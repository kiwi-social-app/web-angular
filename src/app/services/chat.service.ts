import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";
import { Message } from '../models/message.model';


@Injectable({
  providedIn: 'root',
})
export class ChatService {

  public message$: BehaviorSubject<Message> = new BehaviorSubject<Message>({body:'', author:{uid:'', email:''}});
  constructor() {}

  socket = io('http://localhost:8080');

  public sendMessage(message : Message) {
    this.socket.emit('message', message);
  }

  public getNewMessage = () => {
    this.socket.on('message', (message) =>{
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };
}
