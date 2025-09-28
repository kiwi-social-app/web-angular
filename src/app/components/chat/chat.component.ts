import {
  AfterViewChecked,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { WsChatService } from '../../services/ws-chat.service';
import { AuthService } from '../../services/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, take } from 'rxjs';
import { MessageComponent } from '../message/message.component';
import { User } from '@angular/fire/auth';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/chat.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { NewChatModalComponent } from '../modals/new-chat-modal/new-chat-modal.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Message } from '../../models/message.model';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-chat',
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MessageComponent,
    AsyncPipe,
    MatCard,
    MatCardContent,
    CdkTextareaAutosize,
    MatInput,
    MatIcon,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  standalone: true,
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageList') private messageListContainer!: ElementRef;

  private readonly wsChatService: WsChatService = inject(WsChatService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly chatService: ChatService = inject(ChatService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly dialog: MatDialog = inject(MatDialog);

  protected messages!: Observable<Message[]>;
  protected messageForm!: FormGroup;
  protected currentUser!: User | null;
  protected chats$!: Observable<Chat[]>;
  protected selectedChat!: Chat;
  private shouldScroll = false;

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      this.chats$ = this.chatService
        .getChatsByUser(this.currentUser.uid)
        .pipe(takeUntilDestroyed(this.destroyRef));
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  protected onChatClick(chat: Chat): void {
    this.selectedChat = chat;
    if (this.currentUser) {
      this.wsChatService.fetchMessagesFromBackend(this.selectedChat.id);
      this.messages = this.wsChatService.getMessages(this.selectedChat.id);

      this.wsChatService.subscribeToMessages(this.selectedChat.id);
      this.messages.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.shouldScroll = true;
      });
    }
  }

  protected startNewChat(userId: string): void {
    const dialogRef = this.dialog.open(NewChatModalComponent, {
      data: { userId },
      height: '40rem',
      width: '30rem',
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result.length > 0) {
          this.chatService.startChat(userId, result).subscribe(() => {
            this.chats$ = this.chatService
              .getChatsByUser(userId)
              .pipe(takeUntilDestroyed(this.destroyRef));
          });
        }
      });
  }

  protected onSendMessage(event: any): void {
    event.preventDefault();

    if (this.wsChatService.connected()) {
      if (!this.messageForm.invalid) {
        this.wsChatService.sendMessage(
          this.selectedChat.id,
          this.authService.getCurrentUser()!.uid,
          this.messageForm.controls['message'].value,
        );
        this.messageForm.reset();
      }
    } else {
      console.error('WebSocket connection is not yet established!');
    }
  }

  private scrollToBottom(): void {
    try {
      this.messageListContainer.nativeElement.scrollTop =
        this.messageListContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll to bottom failed:', err);
    }
  }
}
