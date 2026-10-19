import React, { useState, useEffect } from 'react';
import { ExerciseNode, BranchId, TierLevel, ScoreUnit } from '../types/techTree';
import { BRANCHES } from '../data/defaultExercises';
import { X, Plus, Sparkles } from 'lucide-react';
import { playTapSound, playTickSound } from '../utils/audio';
import { findAvailableNodePosition } from '../utils/treeLayout';

interface AddExerciseModalProps {
  existingExercises: ExerciseNode[];
  onClose: () => void;
  onAddExercise: (newExercise: ExerciseNode) => void;
}

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  existingExercises,
  onClose,
  onAddExercise,
}) => {
  const [title, setTitle] = useState('');
  const [branch, setBranch] = useState<BranchId>('push');
  const [tier, setTier] = useState<TierLevel>(2);
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState<ScoreUnit>('reps');
  const [targetScore, setTargetScore] = useState<number>(10);
  const [targetWeight, setTargetWeight] = useState<number>(0);
  const [selectedPrereqs, setSelectedPrereqs] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [tipsText, setTipsText] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const togglePrereq = (id: string) => {
    playTickSound();
    setSelectedPrereqs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Determine coordinate placement in bottom-to-top layout
    const branchXMap: Record<BranchId, number> = {
      push: 360,
      pull: 1280,
      levers: 1860,
      core: 2500,
      legs: 2900,
    };

    const tierYMap: Record<TierLevel, number> = {
      1: 1200,
      2: 920,
      3: 640,
      4: 360,
      5: 100,
    };

    const existingInTier = existingExercises.filter(
      (e) => e.branch === branch && e.tier === tier
    ).length;

    const suggestedPosition = findAvailableNodePosition(existingExercises, {
      x: branchXMap[branch] + (existingInTier % 3) * 160,
      y: tierYMap[tier],
    });

    const newExercise: ExerciseNode = {
      id: `custom_${Date.now()}`,
      title: title.trim(),
      branch,
      category: category.trim() || `${branch.toUpperCase()} / Custom Skill`,
      tier,
      x: suggestedPosition.x,
      y: suggestedPosition.y,
      iconKey:
        branch === 'push'
          ? 'push_standard'
          : branch === 'pull'
          ? 'pull_standard'
          : branch === 'levers'
          ? 'fl_full'
          : branch === 'core'
          ? 'core_lsit_floor'
          : 'legs_pistol',
      unit,
      targetScore: Math.max(1, targetScore),
      targetWeightKg: unit === 'kg_reps' ? targetWeight : undefined,
      userBestScore: null,
      userBestWeightKg: null,
      prerequisites: selectedPrereqs,
      description: description.trim() || 'Custom athletic calisthenics skill progression.',
      tips: tipsText
        ? tipsText.split('\n').filter((t) => t.trim().length > 0)
        : ['Maintain clean strict biomechanics', 'Full range of motion lockout'],
      mistakes: ['Rushing the negative eccentric', 'Compromising core bracing'],
      history: [],
      isCustom: true,
    };

    playTapSound();
    onAddExercise(newExercise);
    onClose();
  };

  const branchExercises = existingExercises.filter((e) => e.branch === branch);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Scrim */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl max-h-[90vh] rounded-[32px] glass-chrome border border-white/12 shadow-2xl flex flex-col overflow-hidden text-slate-100 z-10">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-apple-title text-white">
                Add Custom Skill Node
              </h2>
              <p className="text-xs text-slate-400">Expand your Calisthenics Tech Tree</p>
            </div>
          </div>

          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-slate-300 hover:text-white transition-all apple-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Skill Title */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Skill / Exercise Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Ring Handstand, Front Lever Toes Touch..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/12 text-white focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Branch & Tier */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Discipline Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as BranchId)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-(--surface) border border-white/12 text-white focus:outline-none focus:border-blue-500"
              >
                {BRANCHES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Difficulty Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(parseInt(e.target.value) as TierLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-(--surface) border border-white/12 text-white focus:outline-none focus:border-blue-500"
              >
                <option value={1}>Tier 1 — Foundation</option>
                <option value={2}>Tier 2 — Intermediate</option>
                <option value={3}>Tier 3 — Advanced</option>
                <option value={4}>Tier 4 — Master Athlete</option>
                <option value={5}>Tier 5 — Elite Olympian</option>
              </select>
            </div>
          </div>

          {/* Measurement Unit & Target Score */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Measurement Type</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as ScoreUnit)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-(--surface) border border-white/12 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="reps">Repetitions (e.g. 15 reps)</option>
                <option value="seconds">Hold Duration (e.g. 30 seconds)</option>
                <option value="kg_reps">Weighted Reps (+kg x reps)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Target Score to Master ({unit === 'seconds' ? 'seconds' : 'reps'})
              </label>
              <input
                type="number"
                min="1"
                value={targetScore}
                onChange={(e) => setTargetScore(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/12 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* If weighted, added weight target */}
          {unit === 'kg_reps' && (
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Weight (+kg)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/12 text-amber-300 font-mono"
              />
            </div>
          )}

          {/* Prerequisites Selector */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              Select Prerequisites (Required to unlock this skill):
            </label>
            <div className="max-h-36 overflow-y-auto p-2 rounded-xl bg-black/30 border border-white/10 space-y-1">
              {branchExercises.map((ex) => {
                const isSelected = selectedPrereqs.includes(ex.id);
                return (
                  <div
                    key={ex.id}
                    onClick={() => togglePrereq(ex.id)}
                    className={`p-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-600/30 border border-blue-500/40 text-white'
                        : 'hover:bg-white/5 border border-transparent text-slate-400'
                    }`}
                  >
                    <span>
                      {ex.title} (Tier {ex.tier})
                    </span>
                    <span className="font-mono text-[10px]">
                      {isSelected ? '✓ Required' : '+ Add'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Short Description</label>
            <textarea
              rows={2}
              placeholder="Brief description of the movement and purpose..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/12 text-white focus:outline-none focus:border-white/25 resize-none"
            />
          </div>

          {/* Form Tips */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Form Cues (one per line)</label>
            <textarea
              rows={2}
              placeholder="Lock elbows completely&#10;Hollow body shape"
              value={tipsText}
              onChange={(e) => setTipsText(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/12 text-white focus:outline-none focus:border-white/25 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/30 apple-press flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Skill to Tech Tree
          </button>
        </form>
      </div>
    </div>
  );
};
