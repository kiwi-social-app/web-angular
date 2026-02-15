import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chat } from '../models/chat.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly chatApiUrl: string = `${environment.apiUrl}/chat`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('firebase_jwt_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  public getChatsByUser() {
    return this.http.get<Chat[]>(`${this.chatApiUrl}/user/me`, {
      headers: this.getAuthHeaders(),
    });
  }

  public startChat(participantIds: string[]) {
    return this.http.post(
      `${this.chatApiUrl}/start`,
      { participantIds },
      { headers: this.getAuthHeaders() },
    );
  }
}
