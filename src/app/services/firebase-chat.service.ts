import { inject, Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Database } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class FirebaseChatService {
  private database = inject(Database);

  constructor(
    // private db: AngularFireDatabase,
    private authService: AuthService,
  ) {
    console.log('AngularFireDatabase:', this.database);
  }

  // Send a message to Firebase
  sendMessage(message: string) {
    this.authService.authState().subscribe((user) => {
      if (user) {
        // const messageRef = this.database.list('/messages');
        // messageRef.push({
        //   content: message,
        //   sender: user.email,
        //   timestamp: Date.now(),
        // });
      }
    });
  }

  // getMessages(): Observable<any[]> {
  //   return this.db
  //     .list('/messages', (ref) => ref.orderByChild('timestamp').limitToLast(10))
  //     .valueChanges();
  // }
}
