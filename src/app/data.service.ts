import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Post {
  id: string;
  title: string;
  content: string;
  image?: string | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private postsUrl: string = 'http://localhost:4000/posts/';
  private usersUrl: string = 'http://localhost:4000/users/';

  constructor(private http: HttpClient) {}

  public getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl);
  }

  public getPostByID(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.postsUrl}${id}`, httpOptions);
  }

  public addUser(user: any): Observable<any> {
    return this.http.post<any>(this.usersUrl, user, httpOptions);
  }

  public createPost(post: Post): Observable<any> {
    return this.http.post(this.postsUrl, post, httpOptions);
  }

  public signUp(user: User): Observable<any> {
    return this.http.post(this.usersUrl, user, httpOptions);
  }
}
