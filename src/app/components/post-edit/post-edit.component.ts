import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs';
import { confirmPostDeletion } from '../modals/confirm-dialog/confirm-dialog.component';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { StateMessageComponent } from '../state-message/state-message.component';
import { NotificationService } from '../../services/notification.service';
import { notBlank } from '../../validators/not-blank.validator';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LoadingStateComponent,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    RouterLink,
    StateMessageComponent,
  ],
})
export class PostEditComponent implements OnInit {
  private readonly postService: PostService = inject(PostService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly notifications = inject(NotificationService);

  protected updatePostForm!: FormGroup;
  public post!: Post;
  protected loadFailed = false;
  protected readonly pending = signal(false);
  public postID: string | null = String(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void {
    this.getPost();
  }

  protected initialiseForm(): void {
    this.updatePostForm = this.fb.group({
      body: ['', [Validators.required, notBlank]],
    });
  }

  protected getPost() {
    if (this.postID != null) {
      this.loadFailed = false;
      this.postService.getPostByID(this.postID).subscribe({
        next: (post) => {
          this.post = post;
          this.initialiseForm();
          this.updatePostForm.patchValue({ body: post.body });
        },
        error: () => (this.loadFailed = true),
      });
    }
  }

  protected updatePost() {
    if (this.postID == null) {
      return;
    }
    if (this.updatePostForm.invalid) {
      this.updatePostForm.markAllAsTouched();
      return;
    }

    const { body } = this.updatePostForm.getRawValue();
    this.pending.set(true);
    this.postService
      .updatePost(this.postID, body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notifications.show('Post updated');
          this.router.navigate(['/posts', this.postID]);
        },
        error: () => {
          this.pending.set(false);
          this.notifications.show("Couldn't update the post. Try again.");
        },
      });
  }

  protected deletePost(postID: string) {
    confirmPostDeletion(this.dialog)
      .pipe(
        filter(Boolean),
        switchMap(() => this.postService.deletePost(postID)),
      )
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: () =>
          this.notifications.show("Couldn't delete the post. Try again."),
      });
  }
}
