import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { map, Observable, of, switchMap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userLoggedIn!: boolean;
  user$: Observable<any | null | undefined>;
  currentUser!: any;
  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore,
    private userService: UserService
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this.userLoggedIn = false;
    this.afAuth.onAuthStateChanged((user) => {
      this.userLoggedIn = !!user;
    });
  }

  public getCurrentUser() {
    this.afAuth.user.pipe(map((data) => data)).subscribe((data) => {
      this.setUser(data);
    });
    return this.currentUser;
  }
  public setUser(data: any) {
    this.currentUser = data;
  }

  async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    this.updateUserData(credential.user);
    if (credential.additionalUserInfo?.isNewUser) {
      this.userService
        .addUser(credential.user)
        .subscribe((response) => response);
    }

    this.router.navigate(['/']);
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

  signupUser(user: any): Promise<any> {
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        result.user?.sendEmailVerification();
        this.updateUserData(result.user);
        if (result.additionalUserInfo?.isNewUser) {
          this.userService
            .addUser(result.user)
            .subscribe((response) => response);
        }
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
