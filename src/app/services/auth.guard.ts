import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private readonly router: Router = inject(Router);
  private readonly afAuth: Auth = inject(Auth);

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((resolve) => {
      this.afAuth.onAuthStateChanged((user: any) => {
        if (user) {
          resolve(true);
        } else {
          console.log('Auth Guard: user is not logged in');
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
