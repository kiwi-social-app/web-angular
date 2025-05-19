import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Contact, ContactStatus } from '../models/contact.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly userService: UserService = inject(UserService);

  private readonly contactsUrl: string = 'http://localhost:8080/contacts';

  public getContactsByUser(userId: string) {
    return this.http.get<Contact[]>(`${this.contactsUrl}/${userId}`);
  }

  public sendContactRequest(userId: string, contactId: string) {
    return this.http.post<void>(
      `${this.contactsUrl}/${userId}/add/${contactId}`,
      {},
    );
  }

  public acceptContactRequest(
    userId1: string,
    userId2: string,
    contactId: string,
  ) {
    return this.http.put<void>(
      `${this.contactsUrl}/${userId1}/${userId2}/accept/${contactId}`,
      {},
    );
  }

  public getPendingContactsByUser(userId: string) {
    return this.getContactsByUser(userId).pipe(
      map((contacts) =>
        contacts.filter((contact) => contact.status === ContactStatus.PENDING),
      ),
    );
  }

  public getAcceptedContactsByUser(userId: string) {
    return this.getContactsByUser(userId).pipe(
      map((contacts) =>
        contacts.filter((contact) => contact.status === ContactStatus.ACCEPTED),
      ),
    );
  }
}
