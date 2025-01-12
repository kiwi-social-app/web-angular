import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  newMessage!: Message;
  Math = Math;
  messageList: Message[] = [];
  currentUser!: any;
  currentUserInfo!: any;
  form = new FormGroup({
    messageBody: new FormControl('', Validators.required),
    messageAuthor: new FormControl(),
  });

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    public auth: AuthService
  ) {
    this.currentUser = this.auth.getCurrentUser();
  }

  ngOnInit() {
    this.auth.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.getCurrentUserInfo();
      }
    });
    this.chatService.getNewMessage().subscribe((message) => {
      console.log(message);
      this.messageList.push(message);
    });
  }

  getCurrentUserInfo() {
    this.userService.getUserByID(this.currentUser.uid).subscribe((data) => {
      this.currentUserInfo = data;
    });
  }

  sendMessage(currentUserInfo: User) {
    this.newMessage = {
      body: this.form.controls.messageBody.value ?? 'undefined',
      author: currentUserInfo,
    };
    this.chatService.sendMessage(this.newMessage);
  }
}
