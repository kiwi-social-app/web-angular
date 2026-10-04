import { HttpInterceptorFn } from '@angular/common/http';
import { getAuth } from 'firebase/auth';
import { from, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const auth = getAuth();

  return from(
    auth.authStateReady().then(() => auth.currentUser?.getIdToken() ?? null),
  ).pipe(
    switchMap((token) =>
      next(
        token
          ? req.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
            })
          : req,
      ),
    ),
  );
};
