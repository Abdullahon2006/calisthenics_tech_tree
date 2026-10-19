import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ArchivedExerciseNode, ExerciseNode, BranchId, ExerciseRecord } from './types/techTree';
import {
  consumeStorageWarning,
  resetProgress,
  getExerciseStatus,
  calculateUserStats,
  exportTreeData,
  parseImportFile,
  fetchData,
  saveData,
  AuthLostError,
} from './utils/storage';
import { playTapSound, playPRSound } from './utils/audio';
import { Header } from './components/Header';
import { TechTreeCanvas } from './components/TechTreeCanvas';
import { ProgressRoadmapView } from './components/ProgressRoadmapView';
import { ExerciseDetailSheet } from './components/ExerciseDetailSheet';
import { QuickSearchModal } from './components/QuickSearchModal';
import { AddExerciseModal } from './components/AddExerciseModal';
import { ExerciseEditorModal } from './components/ExerciseEditorModal';
import { LoginScreen } from './components/LoginScreen';
import { Toast, Notice } from './components/Toast';
import { fetchSession, login, logout } from './utils/auth';
import { usePage } from './utils/route';
import { ThemePref, applyTheme, getThemePref, setThemePref } from './utils/theme';
import { SettingsPage } from './components/SettingsPage';
import { recordDiagnostic } from './utils/diagnostics';
import { ArchiveModal } from './components/ArchiveModal';
import { findAvailableNodePosition } from './utils/treeLayout';

interface InitialData { exercises: ExerciseNode[]; archived: ArchivedExerciseNode[] }

function TechTreeApp({ initial, onSignOut, onAuthLost }: { initial: InitialData; onSignOut: () => void; onAuthLost: () => void }) {
  const [exercises, setExercises] = useState<ExerciseNode[]>(initial.exercises);
  const [archivedExercises, setArchivedExercises] = useState<ArchivedExerciseNode[]>(initial.archived);
  const [activeBranch, setActiveBranch] = useState<BranchId | 'all'>('all');
  const [page, setPage] = usePage();
  const viewMode = page === 'roadmap' ? 'roadmap' : 'canvas';
  const [themePref, setThemePrefState] = useState<ThemePref>(() => getThemePref());
  const changeTheme = (pref: ThemePref) => { setThemePref(pref); setThemePrefState(pref); };
  useEffect(() => {
    if (themePref !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [themePref]);

  // Modal & Selection States
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isResetOpen, setIsResetOpen] = useState<boolean>(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState<boolean>(false);
  const [archivingExerciseId, setArchivingExerciseId] = useState<string | null>(null);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const noticeTimerRef = useRef<number | null>(null);

  const notify = useCallback((message: string, tone: Notice['tone'] = 'info') => {
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    setNotice({ message, tone });
    noticeTimerRef.current = window.setTimeout(() => setNotice(null), 5000);
  }, []);

  useEffect(() => () => {
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
  }, []);

  useEffect(() => {
    const warning = consumeStorageWarning();
    if (warning) notify(warning, 'error');
  }, [notify]);

  // Save to the laptop's data file shortly after any change (skips the first render).
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    const timer = window.setTimeout(async () => {
      const result = await saveData(exercises, archivedExercises);
      if (result === 'auth') onAuthLost();
      else if (result === 'error') notify('Could not save to the server. Check that it is still running.', 'error');
    }, 300);
    return () => window.clearTimeout(timer);
  }, [exercises, archivedExercises, notify, onAuthLost]);

  // Non-render failures stay visible and do not silently derail the session.
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      recordDiagnostic('window-error', event.error || event.message);
      notify('Something went wrong, but your current screen is still available. You can continue or reload.', 'error');
    };
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      recordDiagnostic('unhandled-promise', event.reason);
      notify('An operation did not complete. Your existing Tech Tree is still safe.', 'error');
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [notify]);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K for quick search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Exercise Map for fast lookups
  const exerciseMap = useMemo(() => {
    const map = new Map<string, ExerciseNode>();
    exercises.forEach((ex) => map.set(ex.id, ex));
    return map;
  }, [exercises]);

  // Compute status for all nodes
  const statusMap = useMemo(() => {
    const map = new Map();
    exercises.forEach((ex) => {
      map.set(ex.id, getExerciseStatus(ex, exerciseMap));
    });
    return map;
  }, [exercises, exerciseMap]);

  // Athlete level, XP, and completion stats
  const stats = useMemo(() => {
    return calculateUserStats(exercises);
  }, [exercises]);

  // Currently selected exercise
  const selectedExercise = useMemo(() => {
    if (!selectedExerciseId) return null;
    return exerciseMap.get(selectedExerciseId) || null;
  }, [selectedExerciseId, exerciseMap]);

  // Record / Update a workout score & PR
  const handleUpdateScore = (
    exerciseId: string,
    score: number,
    addedWeightKg?: number,
    notes?: string
  ) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;

        const newRecord: ExerciseRecord = {
          id: `rec_${Date.now()}`,
          date: new Date().toISOString(),
          score,
          addedWeightKg,
          notes: notes?.trim() || undefined,
        };

        const updatedHistory = [...(ex.history || []), newRecord];

        const bestScore = updatedHistory.reduce((best, record) => Math.max(best, record.score), 0);
        const bestWeight = updatedHistory.reduce((best, record) => Math.max(best, record.addedWeightKg ?? 0), 0);

        return {
          ...ex,
          userBestScore: bestScore || null,
          userBestWeightKg: bestWeight || null,
          history: updatedHistory,
        };
      })
    );
  };

  // Delete a history entry
  const handleDeleteHistoryRecord = (exerciseId: string, recordId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;

        const updatedHistory = ex.history.filter((r) => r.id !== recordId);

        const maxScore = updatedHistory.reduce((best, record) => Math.max(best, record.score), 0) || null;
        const maxWeight = updatedHistory.reduce((best, record) => Math.max(best, record.addedWeightKg ?? 0), 0) || null;

        return {
          ...ex,
          userBestScore: maxScore,
          userBestWeightKg: maxWeight,
          history: updatedHistory,
        };
      })
    );
  };

  // Add custom exercise
  const handleAddExercise = (newExercise: ExerciseNode) => {
    setExercises((prev) => [...prev, newExercise]);
    setSelectedExerciseId(newExercise.id);
  };

  const handleUpdateExercise = (updatedExercise: ExerciseNode) => {
    setExercises((previous) => previous.map((exercise) => exercise.id === updatedExercise.id ? updatedExercise : exercise));
  };

  const archiveCandidate = archivingExerciseId ? exerciseMap.get(archivingExerciseId) : null;

  const handleArchiveExercise = () => {
    if (!archiveCandidate) return;
    const archivedNode: ArchivedExerciseNode = { ...archiveCandidate, archivedAt: new Date().toISOString() };
    setExercises((current) => current.filter((exercise) => exercise.id !== archivedNode.id));
    setArchivedExercises((current) => [...current.filter((exercise) => exercise.id !== archivedNode.id), archivedNode]);
    setSelectedExerciseId(null);
    setEditingExerciseId(null);
    setArchivingExerciseId(null);
    notify(`${archivedNode.title} moved to archive.`, 'success');
  };

  const handleRestoreExercise = (id: string) => {
    const archivedNode = archivedExercises.find((exercise) => exercise.id === id);
    if (!archivedNode) return;
    const { archivedAt: _archivedAt, ...node } = archivedNode;
    const position = findAvailableNodePosition(exercises, node);
    setExercises((current) => [...current, { ...node, ...position }]);
    setArchivedExercises((current) => current.filter((exercise) => exercise.id !== id));
    notify(`${node.title} restored to the Tech Tree.`, 'success');
  };

  // Export JSON
  const handleExportData = () => {
    try {
      exportTreeData(exercises);
      notify('Tech Tree backup downloaded.', 'success');
    } catch (error) {
      recordDiagnostic('export', error);
      notify('Export could not be created. Try again after freeing browser storage.', 'error');
    }
  };

  // Import JSON trigger
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedExercises = await parseImportFile(file);
      setExercises(importedExercises);
      playPRSound();
      notify(`Imported ${importedExercises.length} skills into your Tech Tree.`, 'success');
    } catch (err) {
      recordDiagnostic('import', err);
      notify('Import failed. Use a Tech Tree JSON export with valid exercise data.', 'error');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // Reset to default sample
  const handleResetData = () => {
    setIsResetOpen(true);
  };

  return (
    <div className="relative w-screen h-screen flex flex-col bg-[var(--canvas)] overflow-hidden font-sans">
      {/* Hidden file input for importing JSON */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Floating Translucent Header Bar */}
      <Header
        stats={stats}
        page={page}
        activeBranch={activeBranch}
        archivedCount={archivedExercises.length}
        onNavigate={setPage}
        onSelectBranch={setActiveBranch}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAddModal={() => setIsAddOpen(true)}
        onOpenArchive={() => setIsArchiveOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {page === 'settings' ? (
          <SettingsPage
            themePref={themePref}
            onThemeChange={changeTheme}
            onExport={handleExportData}
            onImport={handleImportClick}
            onReset={handleResetData}
            onSignOut={onSignOut}
          />
        ) : viewMode === 'canvas' ? (
          <TechTreeCanvas
            exercises={exercises}
            statusMap={statusMap}
            selectedExercise={selectedExercise}
            activeBranchFilter={activeBranch}
            onSelectExercise={(ex) => setSelectedExerciseId(ex.id)}
          />
        ) : (
          <ProgressRoadmapView
            exercises={exercises}
            statusMap={statusMap}
            selectedExercise={selectedExercise}
            activeBranchFilter={activeBranch}
            onSelectExercise={(ex) => setSelectedExerciseId(ex.id)}
          />
        )}
      </main>

      {/* Exercise Detail Sheet / PR Tracker Modal */}
      {selectedExercise && (
        <ExerciseDetailSheet
          exercise={selectedExercise}
          status={statusMap.get(selectedExercise.id) || 'locked'}
          exerciseMap={exerciseMap}
          onClose={() => setSelectedExerciseId(null)}
          onSelectExercise={(ex) => setSelectedExerciseId(ex.id)}
          onUpdateScore={handleUpdateScore}
          onDeleteHistoryRecord={handleDeleteHistoryRecord}
          onEditExercise={() => setEditingExerciseId(selectedExercise.id)}
          onArchiveExercise={() => setArchivingExerciseId(selectedExercise.id)}
        />
      )}

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <QuickSearchModal
          exercises={exercises}
          statusMap={statusMap}
          onClose={() => setIsSearchOpen(false)}
          onSelectExercise={(ex) => {
            setSelectedExerciseId(ex.id);
            setIsSearchOpen(false);
          }}
        />
      )}

      {/* Add Custom Skill Modal */}
      {isAddOpen && (
        <AddExerciseModal
          existingExercises={exercises}
          onClose={() => setIsAddOpen(false)}
          onAddExercise={handleAddExercise}
        />
      )}

      {editingExerciseId && exerciseMap.get(editingExerciseId) && (
        <ExerciseEditorModal
          exercise={exerciseMap.get(editingExerciseId)!}
          exercises={exercises}
          onClose={() => setEditingExerciseId(null)}
          onSave={(exercise) => { handleUpdateExercise(exercise); setEditingExerciseId(null); }}
        />
      )}

      {isArchiveOpen && <ArchiveModal exercises={archivedExercises} onClose={() => setIsArchiveOpen(false)} onRestore={handleRestoreExercise} />}

      {archiveCandidate && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button aria-label="Cancel archive" onClick={() => setArchivingExerciseId(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div role="dialog" aria-modal="true" aria-labelledby="archive-confirm-title" className="relative w-full max-w-sm rounded-3xl border border-white/12 bg-(--surface) p-6 shadow-2xl">
            <h2 id="archive-confirm-title" className="text-lg font-bold text-white">Archive {archiveCandidate.title}?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">The node, its records, custom icon, and prerequisites stay recoverable. Nodes that connect to it stay in place. You can restore it any time.</p>
            <div className="mt-6 flex justify-end gap-3"><button onClick={() => setArchivingExerciseId(null)} className="rounded-xl border border-white/12 px-4 py-2 text-sm font-semibold text-slate-200 apple-press">Cancel</button><button onClick={handleArchiveExercise} className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-(color:--on-accent) apple-press">Archive node</button></div>
          </div>
        </div>
      )}

      {isResetOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button aria-label="Cancel reset" onClick={() => setIsResetOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div role="dialog" aria-modal="true" aria-labelledby="reset-title" className="relative w-full max-w-sm rounded-3xl border border-white/12 bg-(--surface) p-6 shadow-2xl">
            <h2 id="reset-title" className="text-lg font-bold text-white">Reset your training progress?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">This preserves every node and icon, but clears all logged sets and personal bests.</p>
            <div className="mt-6 flex justify-end gap-3"><button onClick={() => setIsResetOpen(false)} className="rounded-xl border border-white/12 px-4 py-2 text-sm font-semibold text-slate-200 apple-press">Cancel</button><button onClick={() => { setExercises(resetProgress(exercises)); setSelectedExerciseId(null); setEditingExerciseId(null); setIsResetOpen(false); notify('Training progress reset. Your nodes and icons are unchanged.', 'success'); playTapSound(); }} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-[#ffffff] apple-press">Reset progress</button></div>
          </div>
        </div>
      )}
      <Toast notice={notice} onDismiss={() => setNotice(null)} />
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState<'checking' | 'login' | 'loading' | 'ready' | 'failed'>('checking');
  const [initial, setInitial] = useState<InitialData | null>(null);

  const load = useCallback(async () => {
    setPhase('loading');
    try {
      setInitial(await fetchData());
      setPhase('ready');
    } catch (error) {
      setPhase(error instanceof AuthLostError ? 'login' : 'failed');
    }
  }, []);

  useEffect(() => {
    fetchSession().then((ok) => (ok ? load() : setPhase('login')));
  }, [load]);

  if (phase === 'login') {
    return <LoginScreen onLogin={async (password) => {
      const error = await login(password);
      if (!error) await load();
      return error;
    }} />;
  }

  if (phase === 'ready' && initial) {
    return <TechTreeApp
      initial={initial}
      onSignOut={async () => { await logout(); setPhase('login'); }}
      onAuthLost={() => setPhase('login')}
    />;
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-[var(--canvas)] px-6 text-center text-slate-300">
      {phase === 'failed' ? (
        <div>
          <p className="text-base font-semibold text-white">Could not load your data</p>
          <p className="mt-2 text-sm text-slate-400">Check that the server is running on the laptop.</p>
          <button onClick={load} className="mt-5 rounded-xl bg-yellow-300 px-4 py-2 text-sm font-bold text-(color:--on-accent)">Try again</button>
        </div>
      ) : <p className="text-sm text-slate-400">Loading…</p>}
    </main>
  );
}
