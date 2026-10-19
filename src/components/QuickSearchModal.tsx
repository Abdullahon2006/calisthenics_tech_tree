import React, { useState, useEffect, useRef } from 'react';
import { ExerciseNode, ExerciseStatus } from '../types/techTree';
import { BRANCHES } from '../data/defaultExercises';
import { Search, Trophy, Lock, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { playTapSound, playTickSound } from '../utils/audio';
import { ExerciseArtwork } from './ExerciseArtwork';

interface QuickSearchModalProps {
  exercises: ExerciseNode[];
  statusMap: Map<string, ExerciseStatus>;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseNode) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  exercises,
  statusMap,
  onClose,
  onSelectExercise,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = exercises.filter((ex) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      ex.title.toLowerCase().includes(q) ||
      ex.category.toLowerCase().includes(q) ||
      ex.branch.toLowerCase().includes(q) ||
      ex.tips.some((tip) => tip.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      playTickSound(440);
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      playTickSound(440);
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      playTapSound();
      onSelectExercise(filtered[selectedIndex]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-hidden">
      {/* Scrim */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
      />

      {/* Search Palette Container */}
      <div className="relative w-full max-w-xl rounded-3xl glass-chrome border border-white/12 shadow-[0_30px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-slate-100 z-10">
        {/* Search Bar Input */}
        <div className="p-4 flex items-center gap-3 border-b border-white/8">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search calisthenics skills, progressions, form cues..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching calisthenics skills found for "{query}".
            </div>
          ) : (
            filtered.map((ex, idx) => {
              const status = statusMap.get(ex.id) || 'locked';
              const branch = BRANCHES.find((b) => b.id === ex.branch);
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={ex.id}
                  onClick={() => {
                    playTapSound();
                    onSelectExercise(ex);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-600/25 border border-blue-500/35 text-white'
                      : 'hover:bg-white/5 border border-transparent text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0 p-1">
                      <ExerciseArtwork branch={ex.branch} iconUrl={ex.iconUrl} className="w-9 h-9" muted={status === 'locked'} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">{ex.title}</h4>
                        <span className="text-[10px] font-medium text-slate-400 uppercase">
                          Tier {ex.tier}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{ex.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {status === 'mastered' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mastered
                      </span>
                    ) : status === 'unlocked' ? (
                      <span className="text-[11px] font-mono text-slate-300">
                        PR: {ex.userBestScore !== null ? `${ex.userBestScore} / ${ex.targetScore}` : 'None'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
