import { DestroyRef, inject, Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { myRxStompConfig } from '../rx-stomp.config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WsChatService extends RxStomp {
  private messagesMap: Map<string, BehaviorSubject<any[]>> = new Map();

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly http: HttpClient = inject(HttpClient);

  constructor() {
    super();
    this.configure(myRxStompConfig);
    this.activate();
  }

  private loadMessagesFromStorage(chatId: string): any[] {
    const storedMessages = localStorage.getItem(`chatMessages_${chatId}`);
    return storedMessages ? JSON.parse(storedMessages) : [];
  }

  private saveMessagesToStorage(chatId: string, messages: any[]): void {
    localStorage.setItem(`chatMessages_${chatId}`, JSON.stringify(messages));
  }

  public fetchMessagesFromBackend(chatId: string): void {
    this.http
      .get<any[]>(`http://localhost:8080/chat/messages/${chatId}`)
      .subscribe({
        next: (messages) => {
          if (messages && Array.isArray(messages)) {
            this.getMessageSubject(chatId).next(messages);
            this.saveMessagesToStorage(chatId, messages);
          } else {
            console.error('Unexpected response format:', messages);
          }
        },
        error: (error) => {
          chatId;
          console.error(`Failed to fetch messages for chat ${chatId}:`, error);
        },
      });
  }

  public subscribeToMessages(chatId: string): void {
    this.watch(`/topic/chats/${chatId}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => {
        const parsedMessage = JSON.parse(message.body);
        const messagesSubject = this.getMessageSubject(chatId);
        const updatedMessages = [...messagesSubject.value, parsedMessage];
        const currentMessages = messagesSubject.value;

        const exists = currentMessages.some((m) => m.id === parsedMessage.id);
        if (!exists) {
          const updatedMessages = [...currentMessages, parsedMessage];
          messagesSubject.next(updatedMessages);
          this.saveMessagesToStorage(chatId, updatedMessages);
        }
      });
  }

  public sendMessage(chatId: string, senderId: string, content: string): void {
    const message = { chatId, senderId, content };
    this.publish({
      destination: '/app/sendMessage',
      body: JSON.stringify(message),
    });
  }

  public getMessages(chatId: string): Observable<any[]> {
    return this.getMessageSubject(chatId).asObservable();
  }

  private getMessageSubject(chatId: string): BehaviorSubject<any[]> {
    if (!this.messagesMap.has(chatId)) {
      this.messagesMap.set(
        chatId,
        new BehaviorSubject<any[]>(this.loadMessagesFromStorage(chatId)),
      );
    }
    return this.messagesMap.get(chatId)!;
  }
}
