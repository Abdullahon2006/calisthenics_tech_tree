import React, { useState } from 'react';
import { Download, LogOut, RotateCcw, Upload } from 'lucide-react';
import { ThemePref } from '../utils/theme';
import { changePassword } from '../utils/auth';

interface SettingsPageProps {
  themePref: ThemePref;
  onThemeChange: (pref: ThemePref) => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  onSignOut: () => void;
}

const THEMES: { id: ThemePref; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

const button = 'inline-flex items-center gap-2 rounded-xl border border-white/12 px-3.5 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/8 apple-press';

const Row: React.FC<{ title: string; hint?: string; children: React.ReactNode }> = ({ title, hint, children }) => (
  <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
    <div className="min-w-0">
      <p className="text-sm font-medium text-white">{title}</p>
      {hint && <p className="mt-1 max-w-md text-sm leading-6 text-slate-400">{hint}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mt-10 first:mt-0">
    <h2 className="text-base font-semibold tracking-apple-title text-white">{title}</h2>
    <div className="mt-2 divide-y divide-white/8 border-t border-white/8">{children}</div>
  </section>
);

export const SettingsPage: React.FC<SettingsPageProps> = ({ themePref, onThemeChange, onExport, onImport, onReset, onSignOut }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [repeat, setRepeat] = useState('');
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submitPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (next.length < 10) return setMessage({ ok: false, text: 'Use at least 10 characters.' });
    if (next !== repeat) return setMessage({ ok: false, text: 'The new passwords do not match.' });
    setBusy(true);
    const error = await changePassword(current, next);
    setBusy(false);
    if (error) return setMessage({ ok: false, text: error });
    setCurrent(''); setNext(''); setRepeat('');
    setMessage({ ok: true, text: 'Password changed. Other signed-in devices were signed out.' });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-apple-display text-white">Settings</h1>

        <div className="mt-8">
          <Section title="Appearance">
            <Row title="Theme" hint="System follows your device. This is remembered per device.">
              <div role="radiogroup" aria-label="Theme" className="flex rounded-xl border border-white/10 bg-white/4 p-0.5">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    role="radio"
                    aria-checked={themePref === theme.id}
                    onClick={() => onThemeChange(theme.id)}
                    className={`rounded-[10px] px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      themePref === theme.id ? 'bg-yellow-300 text-(color:--on-accent)' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </Row>
          </Section>

          <Section title="Your data">
            <Row title="Back up" hint="Download everything (logs, custom skills, icons) as one JSON file.">
              <button onClick={onExport} className={button}><Download className="h-4 w-4" /> Download backup</button>
            </Row>
            <Row title="Restore" hint="Replace the current tree with a backup file. This overwrites your current data.">
              <button onClick={onImport} className={button}><Upload className="h-4 w-4" /> Choose backup file</button>
            </Row>
            <Row title="Reset progress" hint="Clears every logged set and personal best. Skills and icons stay.">
              <button onClick={onReset} className={`${button} !border-rose-400/30 text-rose-300 hover:!bg-rose-500/10`}><RotateCcw className="h-4 w-4" /> Reset progress</button>
            </Row>
            <p className="py-4 text-sm leading-6 text-slate-400">
              Saved on this laptop in <span className="font-mono text-slate-300">data/techtree.json</span>, with the last 7 daily backups next to it.
            </p>
          </Section>

          <Section title="Security">
            <form onSubmit={submitPassword} className="py-4">
              <p className="text-sm font-medium text-white">Change password</p>
              <div className="mt-3 grid max-w-sm gap-3">
                <input type="password" autoComplete="current-password" placeholder="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} className="editor-input" aria-label="Current password" />
                <input type="password" autoComplete="new-password" placeholder="New password (10+ characters)" value={next} onChange={(e) => setNext(e.target.value)} className="editor-input" aria-label="New password" />
                <input type="password" autoComplete="new-password" placeholder="Repeat new password" value={repeat} onChange={(e) => setRepeat(e.target.value)} className="editor-input" aria-label="Repeat new password" />
              </div>
              {message && <p role="status" className={`mt-3 text-sm ${message.ok ? 'text-emerald-300' : 'text-rose-300'}`}>{message.text}</p>}
              <button type="submit" disabled={busy || !current || !next} className="mt-4 rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-(color:--on-accent) transition-opacity disabled:opacity-40 apple-press">
                {busy ? 'Saving…' : 'Save password'}
              </button>
            </form>
            <Row title="Sign out" hint="Ends the session on this device.">
              <button onClick={onSignOut} className={button}><LogOut className="h-4 w-4" /> Sign out</button>
            </Row>
          </Section>
        </div>
      </div>
    </div>
  );
};
