import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat } from '../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly chatApiUrl: string = 'http://localhost:8080/chat';

  public getChatsByUser(userId: string) {
    return this.http.get<Chat[]>(`${this.chatApiUrl}/user/${userId}`);
  }

  public startChat(userId: string, participantIds: string[]) {
    return this.http.post(`${this.chatApiUrl}/start/${userId}`, {
      participantIds,
    });
  }
}
