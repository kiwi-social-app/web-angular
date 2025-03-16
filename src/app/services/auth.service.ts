import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { UserService } from './user.service';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly afAuth: AngularFireAuth = inject(AngularFireAuth);
  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);
  private readonly afs: AngularFirestore = inject(AngularFirestore);
  private readonly userService: UserService = inject(UserService);

  private authInstance = getAuth();

  constructor() {
    // Listen for auth state changes (user sign-in or sign-out)
    onAuthStateChanged(this.authInstance, (user) => {
      if (user) {
        // User is signed in, get and store the Firebase ID token
        user.getIdToken().then((idToken) => {
          localStorage.setItem('firebase_jwt_token', idToken); // Store the JWT token in localStorage
        });
      } else {
        // User is signed out, clear any saved JWT token
        localStorage.removeItem('firebase_jwt_token');
      }
    });
  }

  public getCurrentUser() {
    return this.auth.currentUser;
  }

  public async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    await this.updateUserData(credential.user);
    if (credential.additionalUserInfo?.isNewUser) {
      this.userService
        .addUser(credential.user)
        .subscribe((response) => response);
    }

    this.router.navigate(['/']);
  }

  public async signOut() {
    await this.auth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData({
    uid,
    displayname,
    email,
    firstname,
    lastname,
  }: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`user/${uid}`);
    if (displayname === undefined) {
      displayname = '';
    }
    if (firstname === undefined) {
      firstname = '';
    }
    if (lastname === undefined) {
      lastname = '';
    }
    const data = {
      uid,
      displayname,
      email,
      firstname,
      lastname,
    };

    return userRef.set(data, { merge: true });
  }

  public async signupUser(user: any): Promise<any> {
    try {
      let result = await this.afAuth.createUserWithEmailAndPassword(
        user.email,
        user.password,
      );

      if (result.user) {
        await result.user?.sendEmailVerification();
        if (result.additionalUserInfo?.isNewUser) {
          return this.userService
            .addUser(result.user)
            .subscribe((response) => response);
        }
      }
    } catch (error) {
      console.log('Auth Service: signup error', error);
      if (error) {
        return { isValid: false, message: error };
      } else {
        return;
      }
    }
  }

  public loginUser(email: string, password: string): Promise<any> {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Auth Service: loginUser: success');
      })
      .catch((error) => {
        console.log('Auth Service: login error...');
        console.log('error code', error.code);
        console.log('error', error);
        if (error.code) {
          return { isValid: false, message: error.message };
        } else {
          return;
        }
      });
  }

  public authState(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }
}
