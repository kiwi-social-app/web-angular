import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly userService: UserService = inject(UserService);

  private readonly contactsUrl: string = 'http://localhost:8080/contacts/';

  public getContactsByUser(userId: string) {
    return this.http.get<Contact[]>(`${this.contactsUrl}${userId}`);
  }

  public sendContactRequest(userId: string, contactId: string) {
    return this.http.post<void>(
      `${this.contactsUrl}/${userId}/add/${contactId}`,
      {},
    );
  }
}
