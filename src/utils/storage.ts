import { ArchivedExerciseNode, BranchId, ExerciseNode, ExerciseRecord, ExerciseStatus, ScoreUnit, TierLevel, UserStats } from '../types/techTree';
import { INITIAL_EXERCISES } from '../data/defaultExercises';
import { recordDiagnostic } from './diagnostics';

const BRANCH_IDS: BranchId[] = ['push', 'pull', 'levers', 'core', 'legs'];
const SCORE_UNITS: ScoreUnit[] = ['reps', 'seconds', 'kg_reps'];
let pendingLoadWarning: string | null = null;

export function consumeStorageWarning(): string | null {
  const warning = pendingLoadWarning;
  pendingLoadWarning = null;
  return warning;
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const finiteNumber = (value: unknown, fallback: number) => typeof value === 'number' && Number.isFinite(value) ? value : fallback;
const safeIconUrl = (value: unknown) => typeof value === 'string' && /^(https?:|data:image\/)/i.test(value) ? value : undefined;

/** Correct a shipped collision without disturbing any other user-authored layout. */
function applyLayoutFixes(node: ExerciseNode): ExerciseNode {
  if (node.id === 'hspu_wall' && node.x === 1030 && node.y === 640) {
    return { ...node, x: 940, y: 500 };
  }
  return node;
}

function normaliseRecord(value: unknown): ExerciseRecord | null {
  if (!isRecord(value) || typeof value.id !== 'string' || !value.id) return null;
  const score = finiteNumber(value.score, -1);
  if (score < 0) return null;
  return {
    id: value.id,
    date: typeof value.date === 'string' && !Number.isNaN(Date.parse(value.date)) ? value.date : new Date(0).toISOString(),
    score,
    addedWeightKg: typeof value.addedWeightKg === 'number' && value.addedWeightKg >= 0 ? value.addedWeightKg : undefined,
    notes: typeof value.notes === 'string' ? value.notes.slice(0, 1000) : undefined,
  };
}

/** Sanitise persisted/imported JSON before it is allowed into React rendering. */
export function normaliseExercises(value: unknown): ExerciseNode[] {
  if (!Array.isArray(value)) throw new Error('The file must contain an array of exercise nodes.');
  const seenIds = new Set<string>();
  const nodes = value.flatMap((item, index): ExerciseNode[] => {
    if (!isRecord(item) || typeof item.id !== 'string' || !item.id || seenIds.has(item.id)) return [];
    seenIds.add(item.id);
    const branch = BRANCH_IDS.includes(item.branch as BranchId) ? item.branch as BranchId : 'push';
    const unit = SCORE_UNITS.includes(item.unit as ScoreUnit) ? item.unit as ScoreUnit : 'reps';
    const tierCandidate = finiteNumber(item.tier, 1);
    const tier = Math.min(5, Math.max(1, Math.round(tierCandidate))) as TierLevel;
    const history = Array.isArray(item.history) ? item.history.map(normaliseRecord).filter((record): record is ExerciseRecord => Boolean(record)) : [];
    const scoreFromHistory = history.reduce((best, record) => Math.max(best, record.score), 0);
    const weightFromHistory = history.reduce((best, record) => Math.max(best, record.addedWeightKg ?? 0), 0);
    return [{
      id: item.id,
      title: typeof item.title === 'string' && item.title.trim() ? item.title.trim().slice(0, 120) : `Untitled exercise ${index + 1}`,
      branch,
      category: typeof item.category === 'string' ? item.category.slice(0, 120) : `${branch} skill`,
      tier,
      x: finiteNumber(item.x, 180 + index * 32),
      y: finiteNumber(item.y, 920),
      iconKey: typeof item.iconKey === 'string' ? item.iconKey : undefined,
      iconUrl: safeIconUrl(item.iconUrl),
      unit,
      targetScore: Math.max(1, finiteNumber(item.targetScore, 10)),
      targetWeightKg: unit === 'kg_reps' ? Math.max(0, finiteNumber(item.targetWeightKg, 0)) : undefined,
      userBestScore: scoreFromHistory || (typeof item.userBestScore === 'number' && item.userBestScore >= 0 ? item.userBestScore : null),
      userBestWeightKg: weightFromHistory || (typeof item.userBestWeightKg === 'number' && item.userBestWeightKg >= 0 ? item.userBestWeightKg : null),
      prerequisites: Array.isArray(item.prerequisites) ? item.prerequisites.filter((id): id is string => typeof id === 'string') : [],
      description: typeof item.description === 'string' ? item.description.slice(0, 2000) : '',
      tips: Array.isArray(item.tips) ? item.tips.filter((tip): tip is string => typeof tip === 'string').slice(0, 20) : [],
      mistakes: Array.isArray(item.mistakes) ? item.mistakes.filter((mistake): mistake is string => typeof mistake === 'string').slice(0, 20) : [],
      history,
      isCustom: Boolean(item.isCustom),
    }];
  });
  const ids = new Set(nodes.map((node) => node.id));
  return nodes.map((node) => ({ ...node, prerequisites: node.prerequisites.filter((id) => id !== node.id && ids.has(id)) }));
}

const blankDefaults = (): ExerciseNode[] =>
  INITIAL_EXERCISES.map((exercise) => ({ ...exercise, userBestScore: null, userBestWeightKg: null, history: [] }));

export class AuthLostError extends Error {}

export function parseArchived(raw: unknown): ArchivedExerciseNode[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  try {
    const archivedAtById = new Map(raw.filter(isRecord).map((item) => [item.id, item.archivedAt]));
    return normaliseExercises(raw).map((node) => ({
      ...node,
      archivedAt: typeof archivedAtById.get(node.id) === 'string'
        ? archivedAtById.get(node.id) as string
        : new Date(0).toISOString(),
    }));
  } catch (error) {
    recordDiagnostic('archive-load', error);
    pendingLoadWarning = 'Archived nodes could not be read. Your active Tech Tree is still available.';
    return [];
  }
}

/** Merge saved nodes over the bundled (blank) tree. First run (no saved data) gives a clean tree. */
export function buildExercises(raw: unknown, archived: ArchivedExerciseNode[]): ExerciseNode[] {
  const archivedIds = new Set(archived.map((exercise) => exercise.id));
  const defaults = blankDefaults().filter((exercise) => !archivedIds.has(exercise.id));
  if (raw === null || raw === undefined) return defaults;
  try {
    const parsed = normaliseExercises(raw);
    if (parsed.length === 0) return defaults;
    const savedMap = new Map(parsed.map((item) => [item.id, item]));
    const merged = defaults.map((fresh) => {
      const saved = savedMap.get(fresh.id);
      return saved ? { ...fresh, ...saved, history: saved.history ?? fresh.history } : fresh;
    });
    const customNodes = parsed.filter((item) => item.isCustom && !archivedIds.has(item.id));
    return [...merged, ...customNodes].map(applyLayoutFixes);
  } catch (err) {
    recordDiagnostic('storage-load', err);
    pendingLoadWarning = 'Saved data could not be read, so the starter tree was loaded. Your data file on the laptop was not changed.';
    return defaults;
  }
}

export async function fetchData(): Promise<{ exercises: ExerciseNode[]; archived: ArchivedExerciseNode[] }> {
  const response = await fetch('/api/data', { credentials: 'same-origin' });
  if (response.status === 401) throw new AuthLostError();
  if (!response.ok) throw new Error(`Could not load data (${response.status}).`);
  const body = await response.json();
  const archived = parseArchived(body.archived);
  return { exercises: buildExercises(body.exercises, archived), archived };
}

export async function saveData(exercises: ExerciseNode[], archived: ArchivedExerciseNode[]): Promise<'ok' | 'auth' | 'error'> {
  try {
    const response = await fetch('/api/data', {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exercises, archived }),
    });
    if (response.status === 401) return 'auth';
    return response.ok ? 'ok' : 'error';
  } catch (error) {
    recordDiagnostic('storage-save', error);
    return 'error';
  }
}

/** Reset athlete progress while preserving every built-in and custom node. */
export function resetProgress(exercises: ExerciseNode[]): ExerciseNode[] {
  const resetExercises = exercises.map((exercise) => ({
    ...exercise,
    userBestScore: null,
    userBestWeightKg: null,
    history: [],
  }));
  return resetExercises;
}

function hasMasteredTarget(node: ExerciseNode): boolean {
  const qualifyingRecord = node.history?.some((record) =>
    record.score >= node.targetScore && (!node.targetWeightKg || (record.addedWeightKg ?? 0) >= node.targetWeightKg)
  );
  const isMasteredScore = qualifyingRecord ?? (node.userBestScore !== null && node.userBestScore >= node.targetScore);
  return Boolean(isMasteredScore && (node.targetWeightKg ? qualifyingRecord : true));
}

/**
 * Determine dynamic status of an exercise based on PR and prerequisite completion.
 */
export function getExerciseStatus(
  node: ExerciseNode,
  _exerciseMap?: Map<string, ExerciseNode>
): ExerciseStatus {
  return hasMasteredTarget(node) ? 'mastered' : 'unlocked';
}

export function calculateUserStats(exercises: ExerciseNode[]): UserStats {
  const map = new Map<string, ExerciseNode>();
  exercises.forEach((ex) => map.set(ex.id, ex));

  let totalXp = 0;
  let masteredCount = 0;
  let unlockedCount = 0;
  let totalPRsLogged = 0;

  exercises.forEach((ex) => {
    const status = getExerciseStatus(ex, map);
    totalPRsLogged += ex.history?.length || 0;

    // XP calculation: Tier * 100 for unlocked attempts, Tier * 350 for mastered!
    if (status === 'mastered') {
      masteredCount++;
      unlockedCount++;
      totalXp += ex.tier * 350;
      // Extra XP for exceeding PR
      if (ex.userBestScore && ex.userBestScore > ex.targetScore) {
        totalXp += (ex.userBestScore - ex.targetScore) * 15;
      }
    } else if (status === 'unlocked') {
      unlockedCount++;
      if (ex.userBestScore !== null && ex.userBestScore > 0) {
        // In-progress XP proportional to target
        const pct = Math.min(1, ex.userBestScore / ex.targetScore);
        totalXp += Math.round(ex.tier * 150 * pct);
      }
    }
  });

  // Level curve: Level = 1 + floor(sqrt(totalXp / 120))
  const level = Math.max(1, Math.floor(Math.sqrt(totalXp / 120)) + 1);

  return {
    level,
    totalXp,
    masteredCount,
    unlockedCount,
    totalCount: exercises.length,
    totalPRsLogged,
  };
}

/**
 * Export current tree data as a downloadable JSON file
 */
export function exportTreeData(exercises: ExerciseNode[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exercises, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `calisthenics-techtree-export-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Import tree data from a user-uploaded JSON file
 */
export function parseImportFile(file: File): Promise<ExerciseNode[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = normaliseExercises(JSON.parse(e.target?.result as string));
        if (parsed.length === 0) throw new Error('No valid exercise nodes were found in this file.');
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
