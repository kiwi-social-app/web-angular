import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Post } from '../models/post.model';
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
  // private postsUrl: string = 'http://localhost:8080/post';

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

    // return this.http.get<Post[]>(`${this.postsUrl}/all`);
  }

  public fetchPostByID(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.postsUrl}${id}`, httpOptions);

    // return this.http.get<Post>(`${this.postsUrl}/${id}`, httpOptions);
  }

  public fetchPostsByUserID(userID: string): Observable<Post[]> {
    const url = `${this.postsUrl}?userID=${userID}`;

    // const url = `${this.postsUrl}/user/${userID}`;
    return this.http.get<Post[]>(url);
  }

  public createPost(post: Post): Observable<any> {
    const userID = this.auth.currentUser.uid;
    post.created_at = new Date();
    post.image = this.checkImage(post.image);
    const url = `${this.postsUrl}?userID=${userID}`;
    // const url = `${this.postsUrl}/create/${userID}`;
    return this.http.post(url, post).pipe(map((response) => response));
  }

  public deletePost(id: string): Observable<any> {
    const url = `${this.postsUrl}${id}`;

    // const url = `${this.postsUrl}/${id}`;
    return this.http.delete(url).pipe(
      map((response) => response),
      catchError((error) => error)
    );
  }

  public updatePost(post: Post) {
    const url = `${this.postsUrl}${post.id}`;
    post.updated_at = new Date();
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
}
