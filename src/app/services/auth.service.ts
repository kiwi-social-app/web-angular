import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth: Auth = getAuth();
  private readonly router: Router = inject(Router);

  constructor() {
    localStorage.removeItem('firebase_jwt_token');
  }

  public getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  public async googleSignin(): Promise<void> {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  public async signOut() {
    await signOut(this.auth);
    return this.router.navigate(['/']);
  }

  public async loginUser(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  public authState(): Observable<User | null> {
    return new Observable<User | null>((subscriber) => {
      const unsubscribe = onAuthStateChanged(
        this.auth,
        (user) => subscriber.next(user),
        (err) => subscriber.error(err),
        () => subscriber.complete(),
      );
      return unsubscribe;
    });
  }
}
