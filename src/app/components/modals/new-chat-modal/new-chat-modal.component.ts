import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { UserService } from '../../../services/user.service';
import { map, Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { AsyncPipe } from '@angular/common';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-chat-modal',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    AsyncPipe,
    MatSelectionList,
    MatListOption,
    FormsModule,
  ],
  templateUrl: './new-chat-modal.component.html',
  styleUrl: './new-chat-modal.component.scss',
  standalone: true,
})
export class NewChatModalComponent {
  protected readonly data: { userId: string } = inject(MAT_DIALOG_DATA);
  protected readonly userService: UserService = inject(UserService);
  private readonly dialogRef: MatDialogRef<NewChatModalComponent> = inject(
    MatDialogRef<NewChatModalComponent>,
  );

  protected users$: Observable<User[]>;

  constructor() {
    this.users$ = this.userService
      .getUsers()
      .pipe(
        map((users) => users.filter((user) => user.id !== this.data.userId)),
      );
  }

  protected confirm(selectedUsers: any) {
    this.dialogRef.close(selectedUsers.map((opt: any) => opt.value));
  }
}
