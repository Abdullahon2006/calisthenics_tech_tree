import React from 'react';
import { ExerciseNode, ExerciseStatus, BranchId } from '../types/techTree';
import { BRANCHES } from '../data/defaultExercises';
import { ExerciseNodeCard } from './ExerciseNodeCard';
import { Trophy, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import { MotionMascotIcon } from './SkillVectorIcons';

interface ProgressRoadmapViewProps {
  exercises: ExerciseNode[];
  statusMap: Map<string, ExerciseStatus>;
  selectedExercise: ExerciseNode | null;
  activeBranchFilter: BranchId | 'all';
  onSelectExercise: (exercise: ExerciseNode) => void;
}

export const ProgressRoadmapView: React.FC<ProgressRoadmapViewProps> = ({
  exercises,
  statusMap,
  selectedExercise,
  activeBranchFilter,
  onSelectExercise,
}) => {
  const branchesToRender = BRANCHES.filter(
    (b) => activeBranchFilter === 'all' || b.id === activeBranchFilter
  );

  return (
    <div className="w-full h-full overflow-y-auto px-4 sm:px-8 py-8 space-y-12">
      {branchesToRender.map((branch) => {
        const branchExercises = exercises.filter((e) => e.branch === branch.id);
        const masteredCount = branchExercises.filter((e) => statusMap.get(e.id) === 'mastered').length;
        const branchPct = Math.round((masteredCount / Math.max(1, branchExercises.length)) * 100);

        // Group by Tier (1 to 5)
        const tiers = [1, 2, 3, 4, 5] as const;

        return (
          <div key={branch.id} className="space-y-6 max-w-7xl mx-auto">
            {/* Branch Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-[16px] flex items-center justify-center border border-white/10 shadow-lg" style={{ backgroundColor: '#202018' }}>
                  <MotionMascotIcon id={`branch-${branch.id}`} className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-apple-title text-white">
                    {branch.name}
                  </h2>
                  <p className="text-xs text-slate-400">{branch.description}</p>
                </div>
              </div>

              {/* Branch Completion Bar */}
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/8">
                <div className="text-right">
                  <div className="text-xs font-bold text-white font-mono">
                    {masteredCount} / {branchExercises.length} Mastered
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{branchPct}% Complete</div>
                </div>
                <div className="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${branchPct}%`,
                      backgroundColor: branch.color,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Tiers Grid */}
            <div className="space-y-8">
              {tiers.map((tier) => {
                const tierExercises = branchExercises.filter((e) => e.tier === tier);
                if (tierExercises.length === 0) return null;

                const tierLabels = [
                  'Tier 1 — Fundamental Conditioning',
                  'Tier 2 — Intermediate Milestones',
                  'Tier 3 — Advanced Calisthenics',
                  'Tier 4 — Master Athlete Feats',
                  'Tier 5 — Elite / Olympian Mastery',
                ];

                return (
                  <div key={tier} className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: branch.color }}
                      />
                      <span>{tierLabels[tier - 1]}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                      {tierExercises.map((exercise) => {
                        const status = statusMap.get(exercise.id) || 'locked';
                        const isSelected = selectedExercise?.id === exercise.id;

                        return (
                          <div key={exercise.id} className="flex justify-center">
                            <ExerciseNodeCard
                              exercise={exercise}
                              status={status}
                              isSelected={isSelected}
                              onClick={onSelectExercise}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
