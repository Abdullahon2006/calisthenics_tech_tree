import React, { useState, useEffect, useRef } from 'react';
import { ExerciseNode, ExerciseRecord, ExerciseStatus } from '../types/techTree';
import { BRANCHES } from '../data/defaultExercises';
import {
  X,
  Trophy,
  Play,
  Square,
  RotateCcw,
  CheckCircle2,
  Lock,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Dumbbell,
  Clock,
  Trash2,
  Flame,
  AlertTriangle,
  Lightbulb,
  Pencil,
  Archive,
} from 'lucide-react';
import { playTapSound, playTickSound, playPRSound, playUnlockSound } from '../utils/audio';
import { ExerciseArtwork } from './ExerciseArtwork';

interface ExerciseDetailSheetProps {
  exercise: ExerciseNode | null;
  status: ExerciseStatus;
  exerciseMap: Map<string, ExerciseNode>;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseNode) => void;
  onUpdateScore: (
    exerciseId: string,
    score: number,
    addedWeightKg?: number,
    notes?: string
  ) => void;
  onDeleteHistoryRecord: (exerciseId: string, recordId: string) => void;
  onEditExercise: () => void;
  onArchiveExercise: () => void;
}

export const ExerciseDetailSheet: React.FC<ExerciseDetailSheetProps> = ({
  exercise,
  status,
  exerciseMap,
  onClose,
  onSelectExercise,
  onUpdateScore,
  onDeleteHistoryRecord,
  onEditExercise,
  onArchiveExercise,
}) => {
  if (!exercise) return null;

  const branch = BRANCHES.find((b) => b.id === exercise.branch);
  const branchColor = branch?.color || '#0A84FF';

  // State for recording a new score
  const [inputScore, setInputScore] = useState<number>(
    exercise.userBestScore !== null ? exercise.userBestScore : exercise.targetScore
  );
  const [inputWeight, setInputWeight] = useState<number>(
    exercise.userBestWeightKg || exercise.targetWeightKg || 0
  );
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [notes, setNotes] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Live Stopwatch State for isometric holds
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // Drag down to dismiss sheet
  const sheetRef = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState<number>(0);
  const dragStartY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  useEffect(() => {
    // Reset inputs when selected exercise changes
    setInputScore(exercise.userBestScore !== null ? exercise.userBestScore : exercise.targetScore);
    setInputWeight(exercise.userBestWeightKg || exercise.targetWeightKg || 0);
    setNotes('');
    setShowCelebration(false);
    setIsTimerRunning(false);
    setTimerSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [exercise.id]);

  // Stopwatch interval
  useEffect(() => {
    if (isTimerRunning) {
      const startTime = Date.now() - timerSeconds * 1000;
      timerRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setTimerSeconds(Math.round(elapsed * 10) / 10);
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Stopwatch actions
  const toggleTimer = () => {
    playTapSound();
    setIsTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    playTapSound();
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const applyTimerScore = () => {
    playTickSound();
    setInputScore(Math.floor(timerSeconds));
  };

  // Stepper helpers
  const handleScoreDelta = (delta: number) => {
    playTickSound();
    setInputScore((prev) => Math.max(0, prev + delta));
  };

  const handleWeightDelta = (delta: number) => {
    playTickSound();
    setInputWeight((prev) => Math.max(0, Math.round((prev + delta) * 10) / 10));
  };

  // Submit new score record
  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputScore <= 0) return;

    const previousBest = exercise.userBestScore || 0;
    const isNewPR = exercise.userBestScore === null || inputScore > previousBest;
    const willMaster =
      inputScore >= exercise.targetScore &&
      (!exercise.targetWeightKg || inputWeight >= exercise.targetWeightKg);
    const wasMastered = status === 'mastered';

    onUpdateScore(exercise.id, inputScore, exercise.unit === 'kg_reps' ? inputWeight : undefined, notes);
    setNotes('');

    if (willMaster && !wasMastered) {
      playUnlockSound();
      setShowCelebration(true);
    } else if (isNewPR) {
      playPRSound();
      setShowCelebration(true);
    } else {
      playTapSound();
    }
  };

  // Pointer drag gestures for fluid sheet dismiss
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaY = e.clientY - dragStartY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (dragY > 140) {
      onClose();
    }
    setDragY(0);
  };

  // Find prerequisite exercises and child exercises that unlock next
  const prerequisiteNodes = exercise.prerequisites
    .map((id) => exerciseMap.get(id))
    .filter((n): n is ExerciseNode => Boolean(n));

  const unlockedNextNodes = Array.from(exerciseMap.values()).filter((n) =>
    n.prerequisites.includes(exercise.id)
  );

  const isMastered = status === 'mastered';
  const isLocked = status === 'locked';
  const isWeighted = exercise.unit === 'kg_reps';
  const repBest = exercise.history.reduce<ExerciseRecord | null>((best, record) => {
    if (!best || record.score > best.score) return record;
    if (record.score === best.score && (record.addedWeightKg ?? 0) > (best.addedWeightKg ?? 0)) return record;
    return best;
  }, null);
  const bestByWeight = isWeighted
    ? Array.from(
        exercise.history.reduce((records, record) => {
          const weight = record.addedWeightKg ?? 0;
          const current = records.get(weight);
          if (!current || record.score > current.score || (record.score === current.score && record.date > current.date)) {
            records.set(weight, record);
          }
          return records;
        }, new Map<number, ExerciseRecord>()).values()
      ).sort((a, b) => (b.addedWeightKg ?? 0) - (a.addedWeightKg ?? 0))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
      {/* Translucent Dimming Scrim */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Main Glass Sheet Card */}
      <div
        ref={sheetRef}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="
          relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh]
          rounded-t-[32px] sm:rounded-[32px]
          glass-chrome border border-white/12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]
          flex flex-col overflow-hidden text-slate-100 z-10
        "
      >
        {/* Apple Sheet Grab Handle */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing select-none"
        >
          <div className="w-12 h-1.5 rounded-full bg-white/25 hover:bg-white/40 transition-colors" />
        </div>

        {/* Header Bar */}
        <div className="px-6 pb-4 flex items-start justify-between gap-4 border-b border-white/8">
          <div className="flex items-start gap-4">
            {/* Generated athlete artwork */}
            <div className="w-16 h-16 rounded-2xl bg-(--surface) border border-white/12 shadow-lg flex items-center justify-center flex-shrink-0 p-2 relative overflow-hidden group">
              <div
                className="absolute inset-0 rounded-2xl blur-lg opacity-25"
                style={{ backgroundColor: '#FFB703' }}
              />
              <ExerciseArtwork branch={exercise.branch} iconUrl={exercise.iconUrl} className="w-14 h-14 relative z-10" muted={isLocked} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: branchColor }}
                />
                <span className="text-[12px] font-semibold tracking-wider uppercase text-slate-400">
                  Tier {exercise.tier} • {branch?.name}
                </span>

                {isMastered ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Trophy className="w-3 h-3 text-emerald-400" />
                    Mastered
                  </span>
                ) : isLocked ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/5 text-slate-400 border border-white/5">
                    <Lock className="w-3 h-3" />
                    Prerequisites Required
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    In Progress
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-apple-display text-white">
                {exercise.title}
              </h2>
              <p className="text-[13px] text-slate-400 mt-1 max-w-lg leading-relaxed">
                {exercise.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => { playTapSound(); onArchiveExercise(); }}
              aria-label="Archive node"
              title="Archive node"
              className="w-9 h-9 rounded-full bg-white/8 hover:bg-amber-500/20 flex items-center justify-center text-slate-300 hover:text-amber-200 transition-all apple-press"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => { playTapSound(); onEditExercise(); }}
              aria-label="Edit node"
              title="Edit node data and icon"
              className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-slate-300 hover:text-white transition-all apple-press"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => { playTapSound(); onClose(); }}
              aria-label="Close details"
              className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-slate-300 hover:text-white transition-all apple-press"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-5 overflow-y-auto space-y-6">
          {/* Newly Mastered / PR Banner */}
          {showCelebration && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-blue-500/20 border border-emerald-400/30 flex items-center gap-3 animate-pulse-glow">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-200">
                  {isMastered ? 'Skill Mastered! Tech Tree Progress Updated!' : 'New Personal Record Recorded!'}
                </h4>
                <p className="text-xs text-emerald-300/80">
                  Your milestone has been saved to your personal calisthenics athletic record.
                </p>
              </div>
            </div>
          )}

          {/* Current Milestone vs Personal Best Metric Showcase */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/8">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block mb-1">
                Milestone Target
              </span>
              <div className="text-xl font-extrabold font-mono text-white flex items-center gap-1.5">
                {exercise.targetScore}{' '}
                <span className="text-xs font-normal text-slate-400">
                  {exercise.unit === 'seconds' ? 'seconds' : 'reps'}
                </span>
                {exercise.targetWeightKg && (
                  <span className="text-xs font-semibold text-amber-400">
                    (+{exercise.targetWeightKg}kg)
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Required to master & unlock children
              </span>
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                isMastered
                  ? 'bg-emerald-950/30 border-emerald-500/30'
                  : 'bg-white/5 border-white/8'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                  {isWeighted ? 'Rep best' : 'Personal best'}
                </span>
                <Trophy
                  className={`w-3.5 h-3.5 ${
                    isMastered ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                />
              </div>
              <div className="text-xl font-extrabold font-mono text-white flex items-center gap-1.5">
                {exercise.userBestScore !== null ? (
                  <>
                    <span className={isMastered ? 'text-emerald-300' : 'text-white'}>
                    {isWeighted && repBest ? repBest.score : exercise.userBestScore}
                    </span>
                    <span className="text-xs font-normal text-slate-400">
                      {exercise.unit === 'seconds' ? 'seconds' : 'reps'}
                    </span>
                    {isWeighted && repBest?.addedWeightKg ? (
                      <span className="text-xs font-semibold text-amber-400">
                        (+{repBest.addedWeightKg}kg)
                      </span>
                    ) : null}
                  </>
                ) : (
                  <span className="text-sm font-medium text-slate-500">Not recorded yet</span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {exercise.history.length} logged session{exercise.history.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {isWeighted && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <section className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Rep-wise best</h4>
                {repBest ? (
                  <div className="mt-3 flex items-baseline gap-2"><span className="font-mono text-2xl font-extrabold text-white">{repBest.score}</span><span className="text-xs text-slate-400">reps {repBest.addedWeightKg ? `at +${repBest.addedWeightKg}kg` : 'bodyweight'}</span></div>
                ) : <p className="mt-3 text-sm text-slate-500">No weighted set logged yet.</p>}
                <p className="mt-2 text-[11px] leading-4 text-slate-500">Your single set with the most repetitions.</p>
              </section>
              <section className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-4">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-amber-200/80">Best at each weight</h4>
                {bestByWeight.length ? (
                  <div className="mt-3 max-h-28 space-y-1.5 overflow-y-auto pr-1">
                    {bestByWeight.map((record) => <div key={`${record.addedWeightKg}-${record.id}`} className="flex items-center justify-between rounded-lg bg-black/20 px-2.5 py-1.5 text-xs"><span className="font-mono font-bold text-amber-300">+{record.addedWeightKg ?? 0}kg</span><span className="font-mono text-slate-200">{record.score} reps</span></div>)}
                  </div>
                ) : <p className="mt-3 text-sm text-slate-500">Log sets at different loads to build this list.</p>}
                <p className="mt-2 text-[11px] leading-4 text-slate-500">Every load keeps its own best rep count.</p>
              </section>
            </div>
          )}

          {/* Interactive Hold Timer (if exercise is isometric / seconds hold) */}
          {exercise.unit === 'seconds' && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-950/20 to-black/20 border border-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200">
                    Live Isometric Hold Timer
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400">Hold & track live</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-4xl sm:text-5xl font-mono font-extrabold tracking-tight text-white py-1">
                  {timerSeconds.toFixed(1)}
                  <span className="text-xl font-normal text-slate-400 ml-1">s</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={toggleTimer}
                    className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 apple-press transition-all ${
                      isTimerRunning
                        ? 'bg-amber-500 text-black hover:bg-amber-400'
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                  >
                    {isTimerRunning ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" /> Start Timer
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetTimer}
                    className="p-2.5 rounded-xl bg-white/8 hover:bg-white/15 text-slate-300 apple-press"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {timerSeconds > 0 && !isTimerRunning && (
                    <button
                      type="button"
                      onClick={applyTimerScore}
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold apple-press"
                    >
                      Use {Math.floor(timerSeconds)}s
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Record New Score Form */}
          <form onSubmit={handleSaveScore} className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              Log Exercise Result
            </h4>

            {/* Stepper / Input Control */}
            <div className={isWeighted ? 'grid grid-cols-1 gap-3 sm:grid-cols-2' : 'space-y-3'}>
              <div>
              <label className="text-xs font-medium text-slate-400 block">
                {exercise.unit === 'seconds' ? 'Hold time (seconds)' : 'Repetitions'}
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScoreDelta(-5)}
                  className="px-2.5 py-2 rounded-xl bg-white/8 hover:bg-white/15 text-xs font-mono font-bold apple-press text-slate-300"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => handleScoreDelta(-1)}
                  className="p-2 rounded-xl bg-white/8 hover:bg-white/15 text-xs apple-press text-slate-300"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="number"
                  min="0"
                  value={inputScore}
                  onChange={(e) => setInputScore(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-center py-2 bg-black/40 border border-white/15 rounded-xl text-lg font-mono font-extrabold text-white focus:outline-none focus:border-blue-500 transition-colors"
                />

                <button
                  type="button"
                  onClick={() => handleScoreDelta(1)}
                  className="p-2 rounded-xl bg-white/8 hover:bg-white/15 text-xs apple-press text-slate-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScoreDelta(5)}
                  className="px-2.5 py-2 rounded-xl bg-white/8 hover:bg-white/15 text-xs font-mono font-bold apple-press text-slate-300"
                >
                  +5
                </button>
              </div>
              </div>

              {/* Added weight input if weighted skill */}
              {isWeighted && (
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    Added Weight (+kg)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleWeightDelta(-2.5)}
                      className="px-2.5 py-1.5 rounded-xl bg-white/8 text-xs font-bold text-slate-300 apple-press"
                    >
                      -2.5kg
                    </button>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={inputWeight}
                      onChange={(e) => setInputWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full text-center py-1.5 bg-black/40 border border-white/15 rounded-xl text-base font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleWeightDelta(2.5)}
                      className="px-2.5 py-1.5 rounded-xl bg-white/8 text-xs font-bold text-slate-300 apple-press"
                    >
                      +2.5kg
                    </button>
                  </div>
                </div>
              )}

              {/* Workout notes */}
              <div className={isWeighted ? 'sm:col-span-2' : ''}>
                <input
                  type="text"
                  placeholder="Notes (optional, e.g. strict form, felt effortless)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black/30 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-white/25"
                />
              </div>

              {/* Save button */}
              <button
                type="submit"
                className={`${isWeighted ? 'sm:col-span-2' : ''} w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 apple-press flex items-center justify-center gap-2`}
              >
                <Trophy className="w-4 h-4" />
                Record Score & Update Tech Tree
              </button>
            </div>
          </form>

          {/* Form Cues & Common Mistakes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Tips */}
            <div className="p-4 rounded-2xl bg-white/4 border border-white/6 space-y-2">
              <h5 className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                Mastery Form Cues
              </h5>
              <ul className="space-y-1.5 text-slate-300">
                {exercise.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mistakes */}
            <div className="p-4 rounded-2xl bg-white/4 border border-white/6 space-y-2">
              <h5 className="font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Mistakes to Avoid
              </h5>
              <ul className="space-y-1.5 text-slate-300">
                {exercise.mistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tree Navigation: Prerequisites & Next Unlocks */}
          <div className="space-y-3">
            {prerequisiteNodes.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Prerequisites Required:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {prerequisiteNodes.map((p) => {
                    const pDone =
                      p.userBestScore !== null && p.userBestScore >= p.targetScore;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          playTapSound();
                          onSelectExercise(p);
                        }}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-between cursor-pointer apple-press transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {pDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          )}
                          <span className="text-xs font-medium text-slate-200 truncate">
                            {p.title}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {p.userBestScore !== null ? `${p.userBestScore}/${p.targetScore}` : '0'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {unlockedNextNodes.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Unlocks Next in Tech Tree:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {unlockedNextNodes.map((next) => (
                    <div
                      key={next.id}
                      onClick={() => {
                        playTapSound();
                        onSelectExercise(next);
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-between cursor-pointer apple-press transition-colors"
                    >
                      <span className="text-xs font-medium text-slate-200 truncate">
                        {next.title}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Past Workout History Log */}
          {exercise.history.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/8">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {showAllLogs ? `All logs (${exercise.history.length})` : 'Last 7 logs'}
                </h5>
                {exercise.history.length > 7 && (
                  <button type="button" onClick={() => setShowAllLogs((value) => !value)} className="text-[11px] font-semibold text-slate-400 hover:text-white">
                    {showAllLogs ? 'Show last 7' : `Show all ${exercise.history.length}`}
                  </button>
                )}
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {exercise.history
                  .slice()
                  .reverse()
                  .slice(0, showAllLogs ? undefined : 7)
                  .map((rec) => (
                    <div
                      key={rec.id}
                      className="p-2 rounded-xl bg-white/4 border border-white/6 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white">
                            {rec.score} {exercise.unit === 'seconds' ? 'sec' : 'reps'}
                            {rec.addedWeightKg ? ` (+${rec.addedWeightKg}kg)` : ''}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(rec.date).toLocaleDateString()}
                          </span>
                        </div>
                        {rec.notes && (
                          <p className="text-[11px] text-slate-400 mt-0.5 italic">{rec.notes}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          playTapSound();
                          onDeleteHistoryRecord(exercise.id, rec.id);
                        }}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
