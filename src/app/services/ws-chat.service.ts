import { DestroyRef, inject, Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { myRxStompConfig } from '../rx-stomp.config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

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

  private loadMessagesFromStorage(conversationId: string): any[] {
    const storedMessages = localStorage.getItem(
      `chatMessages_${conversationId}`,
    );
    return storedMessages ? JSON.parse(storedMessages) : [];
  }

  private saveMessagesToStorage(conversationId: string, messages: any[]): void {
    localStorage.setItem(
      `chatMessages_${conversationId}`,
      JSON.stringify(messages),
    );
  }

  public fetchMessagesFromBackend(conversationId: string): void {
    this.http
      .get<any[]>(`http://localhost:8080/chat/messages/${conversationId}`)
      .subscribe({
        next: (messages) => {
          if (messages && Array.isArray(messages)) {
            this.getMessageSubject(conversationId).next(messages);
            this.saveMessagesToStorage(conversationId, messages);
          } else {
            console.error('Unexpected response format:', messages);
          }
        },
        error: (error) => {
          console.error(
            `Failed to fetch messages for conversation ${conversationId}:`,
            error,
          );
        },
      });
  }

  public subscribeToMessages(conversationId: string): void {
    this.watch(`/topic/conversations/${conversationId}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => {
        const parsedMessage = JSON.parse(message.body);
        const messagesSubject = this.getMessageSubject(conversationId);
        const updatedMessages = [...messagesSubject.value, parsedMessage];

        messagesSubject.next(updatedMessages);
        this.saveMessagesToStorage(conversationId, updatedMessages);
      });
  }

  public sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ): void {
    const message = { conversationId, senderId, content };
    this.publish({
      destination: '/app/sendMessage',
      body: JSON.stringify(message),
    });
  }

  public getMessages(conversationId: string): Observable<any[]> {
    return this.getMessageSubject(conversationId).asObservable();
  }

  private getMessageSubject(conversationId: string): BehaviorSubject<any[]> {
    if (!this.messagesMap.has(conversationId)) {
      this.messagesMap.set(
        conversationId,
        new BehaviorSubject<any[]>(
          this.loadMessagesFromStorage(conversationId),
        ),
      );
    }
    return this.messagesMap.get(conversationId)!;
  }
}
