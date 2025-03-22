import { Component, inject, OnInit } from '@angular/core';
import { WsChatService } from '../../services/ws-chat.service';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-messages',
  imports: [AsyncPipe, ReactiveFormsModule, MessageComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
  standalone: true,
})
export class MessagesComponent implements OnInit {
  private readonly wsChatService: WsChatService = inject(WsChatService);
  private readonly authService: AuthService = inject(AuthService);

  protected messages!: Observable<any[]>;
  protected messageForm!: FormGroup;

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });

    this.messages = this.wsChatService.getMessages();
  }

  protected onSendMessage(): void {
    if (this.wsChatService.connected()) {
      if (!this.messageForm.invalid) {
        this.wsChatService.sendMessage(
          this.authService.getCurrentUser()!.uid,
          this.messageForm.controls['message'].value,
        );
      }
    } else {
      console.error('WebSocket connection is not yet established!');
    }
  }
}
