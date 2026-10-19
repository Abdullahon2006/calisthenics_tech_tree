import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { recordDiagnostic } from '../utils/diagnostics';

interface ErrorBoundaryProps { children: React.ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState { return { hasError: true }; }

  componentDidCatch(error: Error) { recordDiagnostic('render', error); }

  render() {
    if (!this.state.hasError) return this.props.children;
    return <main className="grid min-h-dvh place-items-center bg-[var(--canvas)] p-6 text-slate-100"><section role="alert" className="w-full max-w-md rounded-3xl border border-rose-400/25 bg-(--surface) p-7 shadow-2xl"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-500/15 text-rose-300"><AlertTriangle className="h-5 w-5" /></div><h1 className="mt-5 text-xl font-bold tracking-apple-title text-white">This screen needs to restart</h1><p className="mt-2 text-sm leading-6 text-slate-400">Your saved Tech Tree data was not cleared. Reload the app to recover.</p><div className="mt-6 flex gap-3"><button onClick={() => this.setState({ hasError: false })} className="rounded-xl border border-white/12 px-4 py-2.5 text-sm font-semibold text-slate-200 apple-press">Try again</button><button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 rounded-xl bg-yellow-300 px-4 py-2.5 text-sm font-bold text-(color:--on-accent) apple-press"><RotateCcw className="h-4 w-4" /> Reload</button></div></section></main>;
  }
}
