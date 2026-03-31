import { inject, Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Post } from '../models/post.model';
import { PostCreation } from '../models/postCreation.model';
import { environment } from '../../environments/environment';

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

  private postsApiUrl: string = `${environment.apiUrl}/posts`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('firebase_jwt_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  public getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsApiUrl}`);
  }

  public getPostByID(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.postsApiUrl}/${id}`, httpOptions);
  }

  public createPost(post: PostCreation): Observable<any> {
    return this.http.post(`${this.postsApiUrl}`, post, {
      headers: this.getAuthHeaders(),
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

  public favoritePost(postId: string): Observable<HttpResponse<void>> {
    return this.http.post<void>(
      `${this.postsApiUrl}/${postId}/favorite`,
      null,
      { headers: this.getAuthHeaders(), observe: 'response' },
    );
  }

  public unfavoritePost(postId: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.postsApiUrl}/${postId}/favorite`, {
      headers: this.getAuthHeaders(),
      observe: 'response',
    });
  }

  public getCurrentUserPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsApiUrl}/mine`, {
      headers: this.getAuthHeaders(),
    });
  }

  public getUserFavorites(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsApiUrl}/favorites`, {
      headers: this.getAuthHeaders(),
    });
  }

  public isPostFavorited(postId: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.postsApiUrl}/${postId}/is-favorited`,
      { headers: this.getAuthHeaders() },
    );
  }

  public addLike(postId: string): Observable<HttpResponse<void>> {
    return this.http.post<void>(`${this.postsApiUrl}/${postId}/like`, null, {
      headers: this.getAuthHeaders(),
      observe: 'response',
    });
  }

  public removeLike(postId: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.postsApiUrl}/${postId}/like`, {
      headers: this.getAuthHeaders(),
      observe: 'response',
    });
  }

  public addDislike(postId: string): Observable<HttpResponse<void>> {
    return this.http.post<void>(`${this.postsApiUrl}/${postId}/dislike`, null, {
      headers: this.getAuthHeaders(),
      observe: 'response',
    });
  }

  public removeDislike(postId: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.postsApiUrl}/${postId}/dislike`, {
      headers: this.getAuthHeaders(),
      observe: 'response',
    });
  }
}
