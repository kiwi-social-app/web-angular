import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { WsChatService } from '../services/ws-chat.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-messages',
  imports: [],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
  standalone: true,
})
export class MessagesComponent implements OnInit {
  private wsChatService: WsChatService = inject(WsChatService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  protected receivedMessages: string[] = [];

  ngOnInit(): void {
    this.wsChatService
      .watch('/topic/demo')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => {
        this.receivedMessages.push(message.body);
      });
  }

  protected onSendMessage(): void {
    const message = `Message generated at ${new Date()}`;
    this.wsChatService.publish({ destination: '/topic/demo', body: message });
  }
}
