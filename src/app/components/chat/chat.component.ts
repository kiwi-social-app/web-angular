import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  newMessage!: Message;
  messageList: Message[] = [];
  currentUser!: any;
  form = new FormGroup({
    messageBody: new FormControl('', Validators.required),
    messageAuthor: new FormControl()
  });

  constructor(private chatService: ChatService, public auth: AuthService) {
    this.currentUser = this.auth.getCurrentUser();
  }

  ngOnInit() {
    this.auth.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
    this.chatService.getNewMessage().subscribe((message) => {
      console.log(message)
      this.messageList.push(message);
    });
  }

  sendMessage() {
    this.newMessage = {
      body: this.form.controls.messageBody.value ?? "undefined",
      author: this.currentUser,
    };
    this.chatService.sendMessage(this.newMessage);
  }
}
