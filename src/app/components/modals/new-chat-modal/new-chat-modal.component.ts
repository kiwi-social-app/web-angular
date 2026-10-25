import {
  Component,
  computed,
  inject,
  resource,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { LoadingStateComponent } from '../../loading-state/loading-state.component';
import { StateMessageComponent } from '../../state-message/state-message.component';

@Component({
  selector: 'app-new-chat-modal',
  imports: [
    LoadingStateComponent,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatListOption,
    MatSelectionList,
    StateMessageComponent,
  ],
  templateUrl: './new-chat-modal.component.html',
  styleUrl: './new-chat-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class NewChatModalComponent {
  private readonly data: { userId: string } = inject(MAT_DIALOG_DATA);
  private readonly userService: UserService = inject(UserService);
  private readonly dialogRef = inject(MatDialogRef<NewChatModalComponent>);

  protected readonly users = resource({
    loader: () => firstValueFrom(this.userService.getUsers()),
  });

  protected readonly otherUsers = computed(() =>
    this.users.hasValue()
      ? this.users.value().filter((user) => user.id !== this.data.userId)
      : [],
  );

  protected readonly selected = signal<readonly MatListOption[]>([]);

  protected confirm(): void {
    this.dialogRef.close(this.selected().map((option) => option.value));
  }
}
