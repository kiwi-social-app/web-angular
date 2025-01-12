import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from './post.model';
import { AuthService } from './auth.service';
import { User } from './user.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // private postsUrl: string = 'http://localhost:4000/posts/';
  // private usersUrl: string = 'http://localhost:4000/users/';
  // private loginUrl: string = 'http://localhost:4000/login/';
  currentUser!: User;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private fireStore: AngularFirestore
  ) {
    this.currentUser = this.auth.getCurrentUser();
  }

  public getAllPosts(): Observable<any> {
    return this.fireStore.collection('posts').snapshotChanges();
  }

  public getPostByID(id: string): any {
    return this.fireStore
      .collection('posts')
      .doc(id)
      .ref.get()
      .then(function (doc) {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log('No such document!');
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
  }

  public createPost(post: Post) {
    post.userID = this.auth.currentUser.uid;
   // post.author = this.auth.currentUser.displayname;
    console.log(post);
    return this.fireStore.collection('posts').add(post);
  }

  public deletePost(id: string) {
    return this.fireStore.collection('posts').doc(id).delete();
  }

  // public addUser(user: any): Observable<any> {
  //   return this.http.post<any>(this.usersUrl, user, httpOptions);
  // }

  // public getAllUsers(): Observable<User[]> {
  //   return this.http.get<User[]>(this.usersUrl);
  // }

  // public signUp(user: User): Observable<any> {
  //   return this.http.post(this.usersUrl, user, httpOptions);
  // }

  // public logIn(login: { displayname: string; password: string }): Observable<any> {
  //   return this.http.post(this.loginUrl, login, httpOptions);
  // }
}
