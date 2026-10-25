import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const auth = getAuth();
  await auth.authStateReady();
  return auth.currentUser ? true : router.parseUrl('/login');
};

export const guestGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const auth = getAuth();
  await auth.authStateReady();
  return auth.currentUser ? router.parseUrl('/') : true;
};
