import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type Notice = { message: string; tone: 'success' | 'error' | 'info' };

export const Toast: React.FC<{ notice: Notice | null; onDismiss: () => void }> = ({ notice, onDismiss }) => {
  if (!notice) return null;
  const Icon = notice.tone === 'error' ? AlertTriangle : notice.tone === 'success' ? CheckCircle2 : Info;
  const tone = notice.tone === 'error' ? 'border-rose-400/35 text-rose-100' : notice.tone === 'success' ? 'border-emerald-400/35 text-emerald-100' : 'border-blue-400/35 text-blue-100';
  return <div className={`fixed right-4 top-4 z-[100] flex max-w-sm items-start gap-3 rounded-2xl border bg-(--surface)/95 p-3.5 shadow-2xl backdrop-blur-xl ${tone}`} role={notice.tone === 'error' ? 'alert' : 'status'} aria-live="polite"><Icon className="mt-0.5 h-4 w-4 shrink-0" /><p className="flex-1 text-sm leading-5">{notice.message}</p><button onClick={onDismiss} aria-label="Dismiss notification" className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-current/70 hover:bg-white/10 hover:text-white apple-press"><X className="h-4 w-4" /></button></div>;
};
