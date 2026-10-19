export async function fetchSession(): Promise<boolean> {
  try {
    const response = await fetch('/api/session', { credentials: 'same-origin' });
    return response.ok && (await response.json()).authenticated === true;
  } catch {
    return false;
  }
}

/** Returns null on success, otherwise a message to show the user. */
export async function login(password: string): Promise<string | null> {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (response.ok) return null;
    const body = await response.json().catch(() => ({}));
    return body.error || 'Could not sign in. Try again.';
  } catch {
    return 'Cannot reach the server. Is it running on the laptop?';
  }
}

export async function logout(): Promise<void> {
  try { await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' }); } catch { /* signing out locally is enough */ }
}

/** Returns null on success, otherwise a message to show the user. */
export async function changePassword(current: string, next: string): Promise<string | null> {
  try {
    const response = await fetch('/api/password', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current, next }),
    });
    if (response.ok) return null;
    const body = await response.json().catch(() => ({}));
    return body.error || 'Could not change the password.';
  } catch {
    return 'Cannot reach the server.';
  }
}
