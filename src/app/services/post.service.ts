import { inject, Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Post } from '../models/post.model';
import { AuthService } from './auth.service';
import { PostCreation } from '../models/postCreation.model';

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

  private postsApiUrl: string = 'http://localhost:8080/posts';

  public getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsApiUrl}/`);
  }

  public getPostByID(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.postsApiUrl}/${id}`, httpOptions);
  }

  public createPost(post: PostCreation): Observable<any> {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const params: HttpParams = new HttpParams().set('userId', currentUser.uid);

    return this.http.post(`${this.postsApiUrl}`, post, {
      params,
      headers: new HttpHeaders({
        Authorization: `Bearer ${currentUser.getIdToken()}`,
        'Content-Type': 'application/json',
      }),
    });
  }

  public deletePost(id: string): Observable<any> {
    const url = `${this.postsApiUrl}/${id}`;

    return this.http.delete(url).pipe(
      map((response) => response),
      catchError((error) => error),
    );
  }

  public updatePost(post: Post) {
    const url = `${this.postsApiUrl}/${post.id}`;
    post.updatedAt = new Date();

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

  public favoritePost(
    postId: string,
    userId: string,
  ): Observable<HttpResponse<void>> {
    return this.http.post<void>(
      `${this.postsApiUrl}/${postId}/favorite`,
      null,
      {
        params: { userId },
        observe: 'response',
      },
    );
  }

  public unfavoritePost(
    postId: string,
    userId: string,
  ): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.postsApiUrl}/${postId}/favorite`, {
      params: { userId },
      observe: 'response',
    });
  }

  public getUserFavorites(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsApiUrl}/favorites`, {
      params: { userId },
    });
  }

  public isPostFavorited(postId: string, userId: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.postsApiUrl}/${postId}/is-favorited`,
      {
        params: { userId },
      },
    );
  }
}
