const DIAGNOSTICS_KEY = 'calisthenics_techtree_diagnostics_v1';
const MAX_ENTRIES = 25;

export interface DiagnosticEntry {
  at: string;
  source: string;
  message: string;
}

/** Keep a small local trail for recovery without collecting or sending user data. */
export function recordDiagnostic(source: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${source}]`, error);
  try {
    const current = JSON.parse(localStorage.getItem(DIAGNOSTICS_KEY) || '[]');
    const entries = Array.isArray(current) ? current : [];
    entries.push({ at: new Date().toISOString(), source, message });
    localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));
  } catch {
    // Diagnostics must never become a second source of failure.
  }
}
