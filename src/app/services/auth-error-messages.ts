import { FirebaseError } from 'firebase/app';

const SILENT_CODES = new Set([
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
]);

const MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/invalid-email': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/too-many-requests':
    'Too many attempts. Wait a few minutes and try again.',
  'auth/network-request-failed':
    "Can't reach the server. Check your connection and try again.",
  'auth/popup-blocked':
    'Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again.',
};

const FALLBACK = 'Something went wrong. Please try again.';

export function authErrorMessage(error: unknown): string | null {
  if (!(error instanceof FirebaseError)) {
    return FALLBACK;
  }
  if (SILENT_CODES.has(error.code)) {
    return null;
  }
  return MESSAGES[error.code] ?? FALLBACK;
}
