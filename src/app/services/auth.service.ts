import {inject, Injectable} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import {of, Subscription} from 'rxjs';
import { UserService } from './user.service';
import {Auth, user} from "@angular/fire/auth";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth)

  userLoggedIn!: boolean;
  user$ = user(this.auth);
  currentUser!: any;
  userSubscription: Subscription;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore,
    private userService: UserService
  ) {
    this.userSubscription = this.user$.subscribe( user => {
      if (user) {
        return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
      }
    );
    this.userLoggedIn = false;
    this.auth.onAuthStateChanged((user) => {
      this.userLoggedIn = !!user;
    })
  }

  public getCurrentUser() {
    this.currentUser = this.auth.currentUser;
    return this.currentUser;
  }

  async googleSignin() {
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

  async signOut() {
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

  async signupUser(user: any): Promise<any> {
    try{
    let result = await this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
    console.log(result);
    if(result.user){
      await result.user?.sendEmailVerification();
      if (result.additionalUserInfo?.isNewUser) {
        return this.userService
          .addUser(result.user)
          .subscribe((response) => response);
      }
    }
    } catch (error){
      console.log('Auth Service: signup error', error);
      if (error) {
        return { isValid: false, message: error };
      } else {
        return;
      }
    }
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
