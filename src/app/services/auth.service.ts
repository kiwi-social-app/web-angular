import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { User } from './user.model';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userLoggedIn!: boolean;
  user$: Observable<User | null | undefined>;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this.userLoggedIn = false;
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });
  }

  async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData({
    uid,
    displayname,
    email,
    firstname,
    lastname,
  }: any) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`user/${uid}`);
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

  signupUser(user: any): Promise<any> {
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        let emailLower = user.email.toLowerCase();
        result.user?.sendEmailVerification();
        this.updateUserData(result.user);
      })
      .catch((error) => {
        console.log('Auth Service: signup error', error);
        if (error.code) {
          return { isValid: false, message: error.message };
        } else {
          return;
        }
      });
  }

  loginUser(email: string, password: string): Promise<any> {
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
}
