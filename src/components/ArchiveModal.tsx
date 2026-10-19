import React, { useEffect } from 'react';
import { ArchiveRestore, History, X } from 'lucide-react';
import { ArchivedExerciseNode } from '../types/techTree';
import { ExerciseArtwork } from './ExerciseArtwork';
import { playTapSound } from '../utils/audio';

interface ArchiveModalProps {
  exercises: ArchivedExerciseNode[];
  onClose: () => void;
  onRestore: (id: string) => void;
}

export const ArchiveModal: React.FC<ArchiveModalProps> = ({ exercises, onClose, onRestore }) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
    <button aria-label="Close archive" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
    <section role="dialog" aria-modal="true" aria-labelledby="archive-title" className="relative z-10 flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-[30px] border border-white/12 bg-(--surface) text-slate-100 shadow-2xl">
      <header className="flex items-center justify-between border-b border-white/8 px-6 py-5"><div><p className="text-sm font-bold text-white" id="archive-title">Archived nodes</p><p className="mt-1 text-xs text-slate-400">Restore a node with its records, icon, and prerequisites intact.</p></div><button onClick={() => { playTapSound(); onClose(); }} aria-label="Close archive" className="grid h-9 w-9 place-items-center rounded-full bg-white/8 text-slate-300 hover:bg-white/16 hover:text-white apple-press"><X className="h-4 w-4" /></button></header>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {exercises.length === 0 ? <div className="grid min-h-52 place-items-center px-6 text-center"><div><History className="mx-auto h-7 w-7 text-slate-600" /><p className="mt-3 text-sm font-semibold text-slate-300">Nothing archived</p><p className="mt-1 text-xs leading-5 text-slate-500">Archived nodes stay here until you restore them.</p></div></div> : <div className="space-y-2">{exercises.slice().sort((a, b) => b.archivedAt.localeCompare(a.archivedAt)).map((exercise) => <div key={exercise.id} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 p-3"><div className="h-12 w-12 shrink-0 rounded-xl bg-black/25 p-1.5"><ExerciseArtwork branch={exercise.branch} iconUrl={exercise.iconUrl} className="h-full w-full" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-white">{exercise.title}</p><p className="mt-0.5 text-xs text-slate-500">Tier {exercise.tier} · Archived {new Date(exercise.archivedAt).toLocaleDateString()}</p></div><button onClick={() => { playTapSound(); onRestore(exercise.id); }} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-yellow-300 px-3 py-2 text-xs font-bold text-(color:--on-accent) apple-press"><ArchiveRestore className="h-3.5 w-3.5" /> Restore</button></div>)}</div>}
      </div>
    </section>
  </div>;
};
