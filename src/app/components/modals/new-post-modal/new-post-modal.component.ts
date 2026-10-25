import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { NotificationService } from '../../../services/notification.service';
import { notBlank } from '../../../validators/not-blank.validator';

@Component({
  selector: 'app-new-post-modal',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
  ],
  templateUrl: './new-post-modal.component.html',
  styleUrl: './new-post-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class NewPostModalComponent {
  private readonly dialogRef = inject(MatDialogRef<NewPostModalComponent>);
  private readonly postService = inject(PostService);
  private readonly notifications = inject(NotificationService);

  protected readonly pending = signal(false);
  protected readonly newPostForm = inject(FormBuilder).nonNullable.group({
    body: ['', [Validators.required, notBlank]],
  });

  protected publish(): void {
    if (this.newPostForm.invalid) {
      this.newPostForm.markAllAsTouched();
      return;
    }

    this.pending.set(true);
    this.postService.createPost(this.newPostForm.getRawValue()).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.pending.set(false);
        this.notifications.show("Couldn't publish your post. Try again.");
      },
    });
  }
}
