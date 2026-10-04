import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat } from '../models/chat.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly chatApiUrl: string = `${environment.apiUrl}/chat`;

  public getChatsByUser() {
    return this.http.get<Chat[]>(`${this.chatApiUrl}/user/me`);
  }

  public startChat(participantIds: string[]) {
    return this.http.post(`${this.chatApiUrl}/start`, { participantIds });
  }
}
