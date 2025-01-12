import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Comment } from '../models/comment.model';
import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private commentsUrl: string = 'http://localhost:4000/comments/';

  constructor(private http: HttpClient, private auth: AuthService) {}

  public fetchComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentsUrl);
  }

  public fetchCommentsByPostID(postID: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.commentsUrl}?postID=${postID}`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public createComment(comment: Comment, postID: string): Observable<any> {
    comment.userID = this.auth.currentUser.uid;
    comment.createdAt = new Date();
    comment.postID = postID;
    return this.http.post(this.commentsUrl, comment).pipe(map((response) => response));
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
