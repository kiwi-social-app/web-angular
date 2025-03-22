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
  private messagesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    this.loadMessagesFromStorage(),
  );
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly http: HttpClient = inject(HttpClient);

  constructor() {
    super();
    this.configure(myRxStompConfig);
    this.activate();
    this.fetchMessagesFromBackend();
    this.subscribeToMessages();
  }

  private loadMessagesFromStorage(): any[] {
    const storedMessages = localStorage.getItem('chatMessages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  }

  private saveMessagesToStorage(messages: any[]): void {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }

  private fetchMessagesFromBackend(): void {
    this.http.get<any[]>('http://localhost:8080/chat/messages').subscribe({
      next: (messages) => {
        if (messages && Array.isArray(messages)) {
          this.messagesSubject.next(messages);
          this.saveMessagesToStorage(messages);
        } else {
          console.error('Unexpected response format:', messages);
        }
      },
      error: (error) => {
        console.error('Failed to fetch messages from backend:', error);
      },
    });
  }

  private subscribeToMessages(): void {
    this.watch('/topic/messages')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => {
        const parsedMessage = JSON.parse(message.body);
        const updatedMessages = [...this.messagesSubject.value, parsedMessage];

        this.messagesSubject.next(updatedMessages);
        this.saveMessagesToStorage(updatedMessages);
      });
  }

  public sendMessage(senderId: string, content: string): void {
    const message = { senderId, content };
    this.publish({
      destination: '/app/sendMessage',
      body: JSON.stringify(message),
    });
  }

  public getMessages(): Observable<any[]> {
    return this.messagesSubject.asObservable();
  }
}
