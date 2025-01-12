import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { User } from '../models/user.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersUrl: string = 'http://localhost:8080/users/';

  constructor(private http: HttpClient) {}

  public addUser(user: any): Observable<any> {
    console.log(user)
    return this.http.post<any>(this.usersUrl, user, httpOptions).pipe(
      tap((response: any) => console.log(response)),
      catchError((error: any) => {
        console.log(error);
        return of(error);
      })
    );
  }

  public updateUser(userID: string, user: any) {
    const url = `${this.usersUrl}${userID}`;
    // user.updated_at = new Date();
    return this.http.put(url, user, httpOptions).pipe(
      tap((response) => {
        console.log(response);
      }),
      catchError((error) => {
        console.log(error);
        return of(error);
      })
    );
  }

  public getUserByID(userID: any) {
    const url = `${this.usersUrl}${userID}`;
    return this.http.get(url, httpOptions).pipe(
      tap((response) => {
        console.log(response);
      }),
      catchError((error) => {
        console.log(error);
        return of(error);
      })
    );
  }

  public fetchUsers(): Observable<User[]> {
   return this.http.get<User[]>(this.usersUrl);
  }
}
