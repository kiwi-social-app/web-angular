import { Component, inject, OnInit } from '@angular/core';
import { WsChatService } from '../../services/ws-chat.service';
import { AuthService } from '../../services/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { MessageComponent } from '../message/message.component';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { User } from '@angular/fire/auth';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule, MessageComponent, AsyncPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  standalone: true,
})
export class ChatComponent implements OnInit {
  private readonly wsChatService: WsChatService = inject(WsChatService);
  private readonly authService: AuthService = inject(AuthService);
  private contactService: ContactService = inject(ContactService);

  protected contacts!: Contact[];
  protected messages!: Observable<any[]>;
  protected messageForm!: FormGroup;
  protected currentUser!: User | null;
  protected currentContact!: Contact;

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      this.contactService
        .getContactsByUser(this.currentUser.uid)
        .subscribe((contacts) => {
          this.contacts = contacts;
          console.log(contacts);
        });
    }
  }

  protected getContactUsername(userId: string, contact: Contact) {
    return userId === contact.user1Id
      ? contact.user2Username
      : contact.user1Username;
  }

  protected onSendMessage(): void {
    if (this.wsChatService.connected()) {
      if (!this.messageForm.invalid) {
        this.wsChatService.sendMessage(
          this.currentContact.conversationId,
          this.authService.getCurrentUser()!.uid,
          this.messageForm.controls['message'].value,
        );
        this.messageForm.reset();
      }
    } else {
      console.error('WebSocket connection is not yet established!');
    }
  }

  protected onContactClick(contact: Contact) {
    this.currentContact = contact;
    if (this.currentUser) {
      this.wsChatService.fetchMessagesFromBackend(contact.conversationId);
      this.messages = this.wsChatService.getMessages(contact.conversationId);

      this.wsChatService.subscribeToMessages(contact.conversationId);
    }
  }
}
