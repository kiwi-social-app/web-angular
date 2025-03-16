import { Component, inject, OnInit } from '@angular/core';
import { FirebaseChatService } from '../../services/firebase-chat.service';
import { FormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-firebase-chat',
  templateUrl: './firebase-chat.component.html',
  styleUrl: './firebase-chat.component.scss',
  standalone: true,
  imports: [FormsModule, AsyncPipe],
})
export class FirebaseChatComponent {
  messages: any[] = [];
  messages$!: Observable<any[]>;
  newMessage: string = '';

  constructor(
    private chatService: FirebaseChatService,
    private db: AngularFireDatabase,
  ) {
    this.messages$ = this.db
      .list('/messages', (ref) => ref.orderByChild('timestamp').limitToLast(10))
      .valueChanges()
      .pipe(tap(console.log));
  }

  // Load messages from Firebase
  // loadMessages() {
  //   this.chatService.getMessages().then((snapshot) => {
  //     if (snapshot.exists()) {
  //       this.messages = Object.values(snapshot.val());
  //     }
  //   });
  // }

  // Send a new message
  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage);
      this.newMessage = ''; // Clear the input field after sending the message
    }
  }
}
