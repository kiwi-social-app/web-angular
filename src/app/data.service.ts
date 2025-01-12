import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'


export interface Post {
  id: number;
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

 public getAllPosts(): Observable<Post[]>{
    return this.http.get<Post[]>('http://localhost:4000/posts')

  }
}
