export type BranchId = 'push' | 'pull' | 'levers' | 'core' | 'legs';

export type TierLevel = 1 | 2 | 3 | 4 | 5;

export type ScoreUnit = 'reps' | 'seconds' | 'kg_reps';

export type ExerciseStatus = 'locked' | 'unlocked' | 'mastered';

export interface ExerciseRecord {
  id: string;
  date: string; // ISO date
  score: number;
  addedWeightKg?: number;
  notes?: string;
}

export interface ExerciseNode {
  id: string;
  title: string;
  branch: BranchId;
  category: string;
  tier: TierLevel;
  x: number;
  y: number;
  unit: ScoreUnit;
  targetScore: number; // e.g. 10 reps, 20 seconds, etc.
  targetWeightKg?: number;
  userBestScore: number | null;
  userBestWeightKg?: number | null;
  prerequisites: string[]; // IDs of required nodes
  description: string;
  tips: string[];
  mistakes: string[];
  history: ExerciseRecord[];
  iconKey?: string;
  /** Optional user-supplied image URL or local data URL. Overrides branch artwork. */
  iconUrl?: string;
  isCustom?: boolean;
}

/** A removed node retained locally for recovery and later restoration. */
export interface ArchivedExerciseNode extends ExerciseNode {
  archivedAt: string;
}

export interface BranchInfo {
  id: BranchId;
  name: string;
  label: string;
  color: string; // HEX
  rgb: string;   // "r, g, b"
  icon: string;
  description: string;
}

export interface UserStats {
  level: number;
  totalXp: number;
  masteredCount: number;
  unlockedCount: number;
  totalCount: number;
  totalPRsLogged: number;
}
