import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
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
export class PostService {
  private postsUrl: string = 'http://localhost:4000/posts/';
  private usersUrl: string = 'http://localhost:4000/users/';

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

  public createPost(post: Post): Observable<any> {
    post.userID = this.auth.currentUser.uid;
    post.createdAt = new Date();
    post.image = this.checkImage(post.image);

    return this.http
      .post(this.postsUrl, post)
      .pipe(map((response) => response));
  }

  public deletePost(id: string): Observable<any> {
    const url = `${this.postsUrl}${id}`;
    return this.http.delete(url).pipe(
      map((response) => response),
      catchError((error) => error)
    );
  }

  public updatePost(post: Post) {
    const url = `${this.postsUrl}${post.id}`;
    post.updatedAt = new Date();
    post.image = this.checkImage(post.image);

    return this.http.put(url, post, httpOptions).pipe(
      tap((response) => {
        console.log(response);
      }),
      catchError((error) => {
        console.log(error);
        return of(error);
      })
    );
  }

  public getPostAuthor(userID: string): Observable<any> {
    return this.http.get<User>(`${this.usersUrl}${userID}`, httpOptions);
  }
}
