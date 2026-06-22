import type { AuthSession } from '@/features/auth/types/session';

export const AUTH_SESSION_STORAGE_KEY = 'fintech-expenses.auth.session';

function isStoredSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const session = value as Partial<AuthSession>;

  return (
    typeof session.accessToken === 'string' &&
    typeof session.user?.id === 'string' &&
    typeof session.user.name === 'string' &&
    typeof session.user.email === 'string'
  );
}

export function loadStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as unknown;

    return isStoredSession(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export function persistSession(session: AuthSession) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    AUTH_SESSION_STORAGE_KEY,
    JSON.stringify(session),
  );
}

export function clearStoredSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}
