import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
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

  public getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsApiUrl}`);
  }

  public getPostByID(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.postsApiUrl}/${id}`, httpOptions);
  }

  public createPost(post: PostCreation): Observable<any> {
    return this.http.post(`${this.postsApiUrl}`, post);
  }

  public deletePost(id: string): Observable<any> {
    const url = `${this.postsApiUrl}/${id}`;
    return this.http.delete(url);
  }

  public updatePost(id: string, body: string) {
    const url = `${this.postsApiUrl}/${id}`;

    return this.http.put(url, { body }).pipe(
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
      { observe: 'response' },
    );
  }

  public unfavoritePost(postId: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.postsApiUrl}/${postId}/favorite`, {
      observe: 'response',
    });
  }

  public getCurrentUserPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsApiUrl}/mine`);
  }

  public getPostsByUser(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsApiUrl}/user/${userId}`);
  }

  public getUserFavorites(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsApiUrl}/favorites`);
  }

  public isPostFavorited(postId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.postsApiUrl}/${postId}/is-favorited`);
  }

  public addLike(postId: string): Observable<HttpResponse<void>> {
    return this.http.post<void>(`${this.postsApiUrl}/${postId}/like`, null, {
      observe: 'response',
    });
  }

  public removeLike(postId: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.postsApiUrl}/${postId}/like`, {
      observe: 'response',
    });
  }

  public addDislike(postId: string): Observable<HttpResponse<void>> {
    return this.http.post<void>(`${this.postsApiUrl}/${postId}/dislike`, null, {
      observe: 'response',
    });
  }

  public removeDislike(postId: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.postsApiUrl}/${postId}/dislike`, {
      observe: 'response',
    });
  }
}
