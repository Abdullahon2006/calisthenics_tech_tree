import React, { useRef, useState } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { BrandMark } from './BrandMark';

interface LoginScreenProps {
  onLogin: (password: string) => Promise<string | null>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);

  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    const message = await onLogin(password);
    setBusy(false);
    if (!message) return;
    setError(message);
    requestAnimationFrame(() => errorRef.current?.focus());
  };

  return (
    <main className="min-h-dvh bg-[var(--canvas)] px-5 py-8 text-slate-100 sm:grid sm:place-items-center">
      <section className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-[30px] border border-white/10 bg-(--surface) shadow-[0_28px_80px_-32px_rgba(0,0,0,0.9)] sm:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden min-h-[410px] overflow-hidden border-r border-white/8 bg-(--surface-raised) p-10 sm:flex sm:flex-col sm:justify-between">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-300/10 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <BrandMark className="h-11 w-11" />
            <span className="text-base font-extrabold tracking-apple-title text-white">Tech Tree</span>
          </div>
          <div className="relative max-w-xs">
            <p className="text-xs font-medium text-yellow-200/80">Personal training record</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-apple-display text-white">Pick up where your training left off.</h1>
            <p className="mt-4 text-sm leading-6 text-slate-400">Your movement map and records are saved on your laptop.</p>
          </div>
        </div>

        <div className="flex min-h-[410px] flex-col justify-center p-6 sm:p-10">
          <div className="mb-8 flex items-center gap-3 sm:hidden">
            <BrandMark className="h-10 w-10" />
            <span className="font-extrabold tracking-apple-title text-white">Tech Tree</span>
          </div>
          <div className="mb-7 grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/6 text-yellow-200"><LockKeyhole className="h-5 w-5" /></div>
          <h2 className="text-2xl font-extrabold tracking-apple-title text-white">Unlock your Tech Tree</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">Enter your password to continue.</p>

          <form className="mt-7" onSubmit={submit} noValidate>
            {error && <div id="login-error" ref={errorRef} tabIndex={-1} role="alert" className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3.5 py-3 text-sm text-rose-200">{error}</div>}
            <label htmlFor="access-code" className="mb-2 block text-sm font-semibold text-slate-200">Password</label>
            <div className="relative">
              <input id="access-code" autoFocus type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); if (error) setError(''); }} aria-invalid={Boolean(error)} aria-describedby={error ? 'login-error' : undefined} className="w-full rounded-xl border border-white/14 bg-black/30 px-3.5 py-3 pr-12 text-base text-white outline-none transition-colors placeholder:text-slate-600 focus:border-yellow-300" placeholder="Enter password" />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-white/8 hover:text-white apple-press">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Works with password managers.</p>
            <button type="submit" className="mt-6 w-full rounded-xl bg-yellow-300 px-4 py-3 text-sm font-extrabold text-(color:--on-accent) shadow-lg shadow-yellow-400/10 transition-colors hover:bg-yellow-200 apple-press">{busy ? 'Signing in…' : 'Enter Tech Tree'}</button>
          </form>
        </div>
      </section>
    </main>
  );
};
