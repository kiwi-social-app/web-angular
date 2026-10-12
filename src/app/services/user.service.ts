import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import { User } from '../models/user.model';
import { getAuth } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { UserUpdate } from '../models/userUpdate.model';

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
  private readonly auth = getAuth();

  private usersUrl: string = `${environment.apiUrl}/users`;

  public updateUser(userID: string, user: UserUpdate): Observable<any> {
    const url = `${this.usersUrl}/${userID}`;
    return this.http.put(url, user, httpOptions).pipe(
      catchError((error) => {
        console.log(error);
        return of(error);
      }),
    );
  }

  public getUserByID(userID: string): Observable<User | any> {
    const url = `${this.usersUrl}/${userID}`;
    return this.http.get<User>(url, httpOptions).pipe(
      catchError((error) => {
        console.log(error);
        return of(error);
      }),
    );
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      catchError((error) => {
        console.log(error);
        return of(error);
      }),
    );
  }

  public getCurrentUser(): Observable<User | null> {
    return from(this.auth.authStateReady()).pipe(
      switchMap(() =>
        this.auth.currentUser === null
          ? of(null)
          : this.http.get<User>(`${this.usersUrl}/me`, httpOptions),
      ),
      catchError((error) => {
        console.log(error);
        return of(error);
      }),
    );
  }
}
