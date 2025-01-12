import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of} from 'rxjs';
import { Comment } from '../models/comment.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private commentsUrl: string = 'http://localhost:8080/comments/';

  constructor(private http: HttpClient, private auth: AuthService) {}

  public fetchComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentsUrl);
  }

  public fetchCommentsByPostID(postID: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.commentsUrl}${postID}`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public createComment(comment: Comment, postID: string): Observable<any> {
    const userID = this.auth.currentUser.uid
    const url = `${this.commentsUrl}`
    comment.created_at = new Date();

    const params = new HttpParams()
      .set('user_id', userID)
      .set('postId', postID)

    return this.http
      .post(url, comment, {params})
      .pipe(map((response) =>
         response
        ),
        catchError((error) => {
          console.log(error);
          return of(error);
        })
      );
  }

  public deleteComment(id: string): Observable<any> {
    const url = `${this.commentsUrl}${id}`;
    return this.http.delete(url).pipe(
      map((response) => response),
      catchError((error) => error)
    );
  }

  public updateComment(comment: Comment): Observable<any> {
    const url = `${this.commentsUrl}${comment.id}`;
    return this.http.put(url, comment).pipe(
      map((response) => response),
      catchError((error) => error)
    );
  }

}
