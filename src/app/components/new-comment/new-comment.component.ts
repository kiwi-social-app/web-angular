import {
  Component,
  EventEmitter,
  inject,
  model,
  ModelSignal,
  Output,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.model';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NotificationService } from '../../services/notification.service';
import { notBlank } from '../../validators/not-blank.validator';

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
  ],
})
export class NewCommentComponent {
  @Output() onNewComment: EventEmitter<Comment> = new EventEmitter();
  public replyInputDisplay: ModelSignal<boolean> = model.required();

  private readonly commentService: CommentService = inject(CommentService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationService);

  private readonly formDirective = viewChild.required(FormGroupDirective);
  protected readonly pending = signal(false);
  protected readonly newCommentForm = inject(FormBuilder).nonNullable.group({
    body: ['', [Validators.required, notBlank]],
  });
  private postID: string = String(this.route.snapshot.paramMap.get('id'));

  createComment() {
    if (this.newCommentForm.invalid) {
      this.newCommentForm.markAllAsTouched();
      return;
    }

    this.pending.set(true);
    this.commentService
      .createComment(this.newCommentForm.getRawValue() as Comment, this.postID)
      .subscribe({
        next: (response) => {
          this.pending.set(false);
          this.onNewComment.emit(response);
          this.formDirective().resetForm();
        },
        error: () => {
          this.pending.set(false);
          this.notifications.show("Couldn't post your comment. Try again.");
        },
      });
  }

  closeInput() {
    this.replyInputDisplay.set(false);
  }
}
