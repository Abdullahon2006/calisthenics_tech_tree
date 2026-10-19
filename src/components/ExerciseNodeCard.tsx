import React from 'react';
import { ExerciseNode, ExerciseStatus } from '../types/techTree';
import { Lock, Star } from 'lucide-react';
import { playTapSound } from '../utils/audio';
import { ExerciseArtwork } from './ExerciseArtwork';

interface ExerciseNodeCardProps {
  exercise: ExerciseNode;
  status: ExerciseStatus;
  isSelected?: boolean;
  onClick: (exercise: ExerciseNode) => void;
}

const ROMAN_TIERS = ['', 'I', 'II', 'III', 'IV', 'V'];

export const ExerciseNodeCard = React.memo<ExerciseNodeCardProps>(({
  exercise,
  status,
  isSelected,
  onClick,
}) => {
  const isMastered = status === 'mastered';
  const isLocked = status === 'locked';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTapSound();
    onClick(exercise);
  };

  const stateLabel = isMastered ? 'mastered' : isLocked ? 'locked' : 'available';

  return (
    <button
      type="button"
      aria-label={`${exercise.title}, tier ${exercise.tier}, ${stateLabel}. Open exercise details.`}
      onClick={handleClick}
      onPointerDown={(event) => event.stopPropagation()}
      className={`
        group relative w-[140px] h-[132px] select-none cursor-pointer rounded-[22px]
        apple-press transition-colors flex flex-col justify-between p-2.5 text-left
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090a0f]
        ${isSelected ? 'z-40 ring-2 ring-yellow-300 ring-offset-2 ring-offset-[#0b0c10]' : 'z-10'}
        ${
          isLocked
            ? 'bg-(--surface)/90 border border-white/8 opacity-55 backdrop-blur-md'
            : isMastered
            ? 'bg-(--surface-raised) border border-yellow-300/55 shadow-lg'
            : 'bg-(--surface) border border-white/12 hover:border-yellow-200/40 shadow-lg'
        }
      `}
    >
      {/* Top Bar: Roman Tier Numeral & Status Gem */}
      <div className="flex items-center justify-between gap-1 w-full z-10">
        <span
          className={`font-mono font-extrabold text-[11px] tracking-wider px-1.5 py-0.5 rounded-md ${
            isMastered
              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
              : isLocked
              ? 'bg-white/5 text-slate-500'
              : 'bg-white/10 text-slate-200'
          }`}
        >
          {ROMAN_TIERS[exercise.tier]}
        </span>

        {/* Status Gem */}
        <div className="flex items-center">
          {isMastered ? (
            <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-400/70 flex items-center justify-center text-amber-300 shadow-sm shadow-amber-500/40">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            </div>
          ) : isLocked ? (
            <div className="w-4 h-4 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-slate-500">
              <Lock className="w-2.5 h-2.5" />
            </div>
          ) : (
            <div className="w-3 h-3 rounded-full bg-yellow-300" />
          )}
        </div>
      </div>

      {/* Center: yellow athlete portrait, kept consistent across every movement. */}
      <div className="relative flex-1 flex items-center justify-center my-0.5 z-10">
        <div className="relative translate-y-0.5">
          <ExerciseArtwork branch={exercise.branch} iconUrl={exercise.iconUrl} className="w-[70px] h-[70px]" muted={isLocked} />
        </div>
      </div>

      {/* Bottom: exercise title */}
      <div className="w-full text-center z-10">
        <h4
          className={`text-[12px] font-bold leading-tight tracking-apple-title truncate px-0.5 ${
            isMastered
              ? 'text-emerald-200'
              : isLocked
              ? 'text-slate-400'
              : 'text-white'
          }`}
        >
          {exercise.title}
        </h4>
      </div>

    </button>
  );
});
