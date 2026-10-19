import React, { useEffect, useMemo, useState } from 'react';
import { BranchId, ExerciseNode, ScoreUnit, TierLevel } from '../types/techTree';
import { BRANCHES } from '../data/defaultExercises';
import { ExerciseArtwork } from './ExerciseArtwork';
import { ImageUp, Save, Trash2, X } from 'lucide-react';
import { playTapSound, playTickSound } from '../utils/audio';
import { findAvailableNodePosition } from '../utils/treeLayout';

interface ExerciseEditorModalProps {
  exercise: ExerciseNode;
  exercises: ExerciseNode[];
  onClose: () => void;
  onSave: (exercise: ExerciseNode) => void;
}

const asLines = (value: string) => value.split('\n').map((line) => line.trim()).filter(Boolean);

export const ExerciseEditorModal: React.FC<ExerciseEditorModalProps> = ({
  exercise,
  exercises,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(exercise.title);
  const [branch, setBranch] = useState<BranchId>(exercise.branch);
  const [category, setCategory] = useState(exercise.category);
  const [tier, setTier] = useState<TierLevel>(exercise.tier);
  const [unit, setUnit] = useState<ScoreUnit>(exercise.unit);
  const [targetScore, setTargetScore] = useState(exercise.targetScore);
  const [targetWeight, setTargetWeight] = useState(exercise.targetWeightKg ?? 0);
  const [x, setX] = useState(exercise.x);
  const [y, setY] = useState(exercise.y);
  const [description, setDescription] = useState(exercise.description);
  const [tips, setTips] = useState(exercise.tips.join('\n'));
  const [mistakes, setMistakes] = useState(exercise.mistakes.join('\n'));
  const [prerequisites, setPrerequisites] = useState<string[]>(exercise.prerequisites);
  const [iconUrl, setIconUrl] = useState(exercise.iconUrl ?? '');

  const availablePrerequisites = useMemo(
    () => exercises.filter((candidate) => candidate.id !== exercise.id),
    [exercise.id, exercises]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const togglePrerequisite = (id: string) => {
    playTickSound();
    setPrerequisites((current) => current.includes(id)
      ? current.filter((candidate) => candidate !== id)
      : [...current, id]);
  };

  const handleIconFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setIconUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    const position = findAvailableNodePosition(
      exercises.filter((candidate) => candidate.id !== exercise.id),
      { x: Number.isFinite(x) ? x : exercise.x, y: Number.isFinite(y) ? y : exercise.y }
    );

    onSave({
      ...exercise,
      title: title.trim(),
      branch,
      category: category.trim() || `${branch} skill`,
      tier,
      unit,
      targetScore: Math.max(1, targetScore || 1),
      targetWeightKg: unit === 'kg_reps' ? Math.max(0, targetWeight || 0) : undefined,
      x: position.x,
      y: position.y,
      description: description.trim(),
      tips: asLines(tips),
      mistakes: asLines(mistakes),
      prerequisites,
      iconUrl: iconUrl.trim() || undefined,
    });
    playTapSound();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <button aria-label="Close editor" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <form onSubmit={handleSubmit} className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[30px] border border-white/12 bg-(--surface) text-slate-100 shadow-2xl">
        <header className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300">Node editor</p>
            <h2 className="mt-1 text-xl font-bold tracking-apple-title text-white">Edit {exercise.title}</h2>
          </div>
          <button type="button" aria-label="Close editor" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-white/8 text-slate-300 transition-colors hover:bg-white/16 hover:text-white apple-press">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-5 overflow-y-auto px-6 py-5 text-sm">
          <section className="grid gap-4 sm:grid-cols-[116px_1fr]">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-2">
              <ExerciseArtwork branch={branch} iconUrl={iconUrl || undefined} className="h-full min-h-24 w-full" />
            </div>
            <div className="space-y-3">
              <Field label="Node name"><input required value={title} onChange={(e) => setTitle(e.target.value)} className="editor-input" /></Field>
              <Field label="Icon URL or data URL"><input value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="https://… or choose a local image" className="editor-input" /></Field>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/12 apple-press">
                  <ImageUp className="h-3.5 w-3.5" /> Upload icon
                  <input type="file" accept="image/*,.svg" className="hidden" onChange={(e) => handleIconFile(e.target.files?.[0])} />
                </label>
                {iconUrl && <button type="button" onClick={() => setIconUrl('')} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 apple-press"><Trash2 className="h-3.5 w-3.5" /> Use branch artwork</button>}
              </div>
              <p className="text-xs leading-5 text-slate-500">Upload any image, paste an image URL, or clear it to restore the branch artwork. Uploaded images stay with this browser profile.</p>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            <Field label="Branch"><select value={branch} onChange={(e) => setBranch(e.target.value as BranchId)} className="editor-input">{BRANCHES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
            <Field label="Tier"><select value={tier} onChange={(e) => setTier(Number(e.target.value) as TierLevel)} className="editor-input">{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>Tier {value}</option>)}</select></Field>
            <Field label="Category"><input value={category} onChange={(e) => setCategory(e.target.value)} className="editor-input" /></Field>
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            <Field label="Tracking"><select value={unit} onChange={(e) => setUnit(e.target.value as ScoreUnit)} className="editor-input"><option value="reps">Repetitions</option><option value="seconds">Seconds held</option><option value="kg_reps">Weighted repetitions</option></select></Field>
            <Field label={unit === 'seconds' ? 'Target seconds' : 'Target reps'}><input type="number" min="1" value={targetScore} onChange={(e) => setTargetScore(Number(e.target.value))} className="editor-input" /></Field>
            {unit === 'kg_reps' ? <Field label="Target added weight (kg)"><input type="number" min="0" step="0.5" value={targetWeight} onChange={(e) => setTargetWeight(Number(e.target.value))} className="editor-input" /></Field> : <div />}
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <Field label="Canvas X"><input type="number" value={x} onChange={(e) => setX(Number(e.target.value))} className="editor-input" /></Field>
            <Field label="Canvas Y"><input type="number" value={y} onChange={(e) => setY(Number(e.target.value))} className="editor-input" /></Field>
          </section>
          <p className="-mt-3 text-xs leading-5 text-slate-500">If a position intersects another card, it will save in the closest open lane instead.</p>

          <Field label="Description"><textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="editor-input resize-none" /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Form cues — one per line"><textarea rows={4} value={tips} onChange={(e) => setTips(e.target.value)} className="editor-input resize-none" /></Field>
            <Field label="Mistakes — one per line"><textarea rows={4} value={mistakes} onChange={(e) => setMistakes(e.target.value)} className="editor-input resize-none" /></Field>
          </div>

          <section>
            <p className="mb-2 text-xs font-semibold text-slate-300">Prerequisites</p>
            <div className="grid max-h-44 grid-cols-1 gap-1.5 overflow-y-auto rounded-2xl border border-white/10 bg-black/20 p-2 sm:grid-cols-2">
              {availablePrerequisites.map((candidate) => {
                const selected = prerequisites.includes(candidate.id);
                return <button key={candidate.id} type="button" onClick={() => togglePrerequisite(candidate.id)} className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${selected ? 'border border-blue-400/40 bg-blue-500/20 text-white' : 'border border-transparent text-slate-400 hover:bg-white/6'}`}><span className="truncate">{candidate.title}</span><span className="ml-2 text-[10px]">{selected ? 'Required' : 'Add'}</span></button>;
              })}
            </div>
          </section>
        </div>

        <footer className="flex justify-end gap-3 border-t border-white/8 bg-black/10 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/8 apple-press">Cancel</button>
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 apple-press"><Save className="h-4 w-4" /> Save node</button>
        </footer>
      </form>
    </div>
  );
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-slate-300"><span className="mb-1.5 block">{label}</span>{children}</label>;
}
