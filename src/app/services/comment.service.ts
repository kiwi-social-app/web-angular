import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Comment } from '../models/comment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly http: HttpClient = inject(HttpClient);

  private commentsUrl: string = `${environment.apiUrl}/comments`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('firebase_jwt_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  public fetchCommentsByPostID(postID: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.commentsUrl}/${postID}`).pipe(
      map((response) => {
        return response;
      }),
    );
  }

  public createComment(comment: Comment, postID: string): Observable<any> {
    comment.createdAt = new Date();

    const params = new HttpParams().set('postId', postID);

    return this.http
      .post(this.commentsUrl, comment, {
        params,
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => response),
        catchError((error) => {
          console.log(error);
          return of(error);
        }),
      );
  }
}
