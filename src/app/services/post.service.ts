import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
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
  private readonly http: HttpClient = inject(HttpClient);
  private readonly authService: AuthService = inject(AuthService);

  private postsUrl: string = 'http://localhost:8080/posts/';

  public checkImage(imageData: any) {
    if (
      imageData === null ||
      imageData === undefined ||
      imageData.length === 0
    ) {
      return '';
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
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return throwError(() => new Error('User is not authenticated'));
    }
    post.createdAt = new Date();
    post.image = this.checkImage(post.image);

    const url = `${this.postsUrl}`;

    const params = new HttpParams().set('user_id', currentUser.uid);

    return this.http.post(url, post, { params }).pipe(
      map((response) => response),
      catchError((error) => {
        console.log(error);
        return of(error);
      }),
    );
  }

  public deletePost(id: string): Observable<any> {
    const url = `${this.postsUrl}${id}`;

    return this.http.delete(url).pipe(
      map((response) => response),
      catchError((error) => error),
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
      }),
    );
  }
}
