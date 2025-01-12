import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface Post {
  id: string;
  title: string;
  body: string;
  image?: string | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private postsUrl: string = 'http://localhost:4000/posts/';
  private usersUrl: string = 'http://localhost:4000/users/';
  private loginUrl: string = 'http://localhost:4000/login/';

  constructor(private http: HttpClient, private fireStore: AngularFirestore) {}

  public getAllPosts(): Observable<any> {
    return this.fireStore.collection('posts').snapshotChanges();
  }

  public getPostByID(id: string): any {
    return this.fireStore
      .collection('posts')
      .doc(id)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          console.log(doc.data());
          return doc.data();
        } else {
          return 'Doc does not exist';
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // public addUser(user: any): Observable<any> {
  //   return this.http.post<any>(this.usersUrl, user, httpOptions);
  // }

  // public getAllUsers(): Observable<User[]> {
  //   return this.http.get<User[]>(this.usersUrl);
  // }

  public createPost(post: Post) {
    return this.fireStore.collection('posts').add(post);
  }

  public deletePost(id: string) {
    return this.fireStore.collection('posts').doc(id).delete();
  }

  public signUp(user: User): Observable<any> {
    return this.http.post(this.usersUrl, user, httpOptions);
  }

  public logIn(login: { username: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, login, httpOptions);
  }
}
