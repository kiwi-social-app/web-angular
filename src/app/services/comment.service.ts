import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Comment } from '../models/comment.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly authService: AuthService = inject(AuthService);

  private commentsUrl: string = `${environment.apiUrl}/comments`;

  public fetchCommentsByPostID(postID: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.commentsUrl}/${postID}`).pipe(
      map((response) => {
        return response;
      }),
    );
  }

  public createComment(comment: Comment, postID: string): Observable<any> {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const url = `${this.commentsUrl}`;
    comment.createdAt = new Date();

    const params = new HttpParams()
      .set('userId', currentUser.uid)
      .set('postId', postID);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentUser.getIdToken()}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(url, comment, { params, headers }).pipe(
      map((response) => response),
      catchError((error) => {
        console.log(error);
        return of(error);
      }),
    );
  }
}
