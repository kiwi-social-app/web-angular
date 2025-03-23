import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly auth: Auth = inject(Auth);

  private usersUrl: string = 'http://localhost:8080/users/';

  public addUser(user: any): Observable<any> {
    return this.http.post<any>(this.usersUrl, user, httpOptions).pipe(
      catchError((error: any) => {
        console.log(error);
        return of(error);
      }),
    );
  }

  public updateUser(userID: string, user: any): Observable<any> {
    const url = `${this.usersUrl}${userID}`;
    return this.http.put(url, user, httpOptions).pipe(
      catchError((error) => {
        console.log(error);
        return of(error);
      }),
    );
  }

  public getUserByID(userID: string): Observable<User | any> {
    const url = `${this.usersUrl}${userID}`;
    return this.http.get(url, httpOptions).pipe(
      catchError((error) => {
        console.log(error);
        return of(error);
      }),
    );
  }

  public fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  public getCurrentUser(): Observable<User | null> {
    const user = this.auth.currentUser;

    if (user !== null) {
      return this.getUserByID(user.uid);
    } else {
      return of(null);
    }
  }
}
