import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class NodejsService {
  private postsUrl: string = 'http://localhost:4000/posts/';
  private usersUrl: string = 'http://localhost:4000/users/';
  private loginUrl: string = 'http://localhost:4000/login/';

  constructor(private http: HttpClient, private auth: AuthService) {}

  public checkImage(imageData: any) {
    if (
      imageData === null ||
      imageData === undefined ||
      imageData.length === 0
    ) {
      return '../../assets/placeholder.png';
    } else {
      return imageData;
    }
  }

  public fetchPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl);
  }

  public fetchPostByID(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.postsUrl}${id}`, httpOptions);
  }

  public addUser(user: any): Observable<any> {
    return this.http.post<any>(this.usersUrl, user, httpOptions);
  }

  public fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  public createPost(post: Post): Observable<any> {
    post.userID = this.auth.currentUser.uid;
    post.createdAt = new Date();
    post.image = this.checkImage(post.image);
    return this.http.post(this.postsUrl, post, httpOptions);
  }

  public signUp(user: User): Observable<any> {
    return this.http.post(this.usersUrl, user, httpOptions);
  }

  public getPostAuthor(userID: string): Observable<any> {
    return this.http.get<User>(`${this.usersUrl}${userID}`, httpOptions);
  }

  public logIn(login: { username: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, login, httpOptions);
  }

}
