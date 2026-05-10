import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  Auth,
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth: Auth = getAuth();
  private readonly router: Router = inject(Router);
  private readonly userService: UserService = inject(UserService);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        user.getIdToken().then((idToken) => {
          localStorage.setItem('firebase_jwt_token', idToken);
        });
      } else {
        localStorage.removeItem('firebase_jwt_token');
      }
    });
  }

  public getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  public async googleSignin() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    if (getAdditionalUserInfo(credential)?.isNewUser) {
      this.userService
        .addUser(credential.user)
        .subscribe((response) => response);
    }
    this.router.navigate(['/']);
  }

  public async signOut() {
    await signOut(this.auth);
    return this.router.navigate(['/']);
  }

  public async signupUser(user: any): Promise<any> {
    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        user.email,
        user.password,
      );

      if (result.user) {
        await sendEmailVerification(result.user);
        if (getAdditionalUserInfo(result)?.isNewUser) {
          return this.userService
            .addUser(result.user)
            .subscribe((response) => response);
        }
      }
    } catch (error) {
      console.log('Auth Service: signup error', error);
      if (error) {
        return { isValid: false, message: error };
      }
      return;
    }
  }

  public loginUser(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        console.log('Auth Service: loginUser: success');
      })
      .catch((error: any) => {
        console.log('Auth Service: login error...');
        console.log('error code', error.code);
        console.log('error', error);
        if (error.code) {
          return { isValid: false, message: error.message };
        }
        return;
      });
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
