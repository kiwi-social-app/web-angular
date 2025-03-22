import { Component, inject, Input, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  standalone: true,
  imports: [AsyncPipe],
})
export class MessageComponent implements OnInit {
  @Input() message!: Message;

  private userService = inject(UserService);

  protected sender!: Observable<User>;

  ngOnInit() {
    this.sender = this.userService.getUserByID(this.message.senderId);
  }
}
