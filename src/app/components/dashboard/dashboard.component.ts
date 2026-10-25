import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../../models/post.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { PostService } from '../../services/post.service';
import { PostCardComponent } from '../post-card/post-card.component';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { StateMessageComponent } from '../state-message/state-message.component';
import { NotificationService } from '../../services/notification.service';
import { notBlank } from '../../validators/not-blank.validator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LoadingStateComponent,
    MatButton,
    MatError,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    PostCardComponent,
    ReactiveFormsModule,
    StateMessageComponent,
  ],
})
export class DashboardComponent implements OnInit {
  private readonly userService: UserService = inject(UserService);
  private readonly postService: PostService = inject(PostService);
  private readonly notifications = inject(NotificationService);

  protected readonly editProfileForm = inject(FormBuilder).nonNullable.group({
    username: ['', [Validators.required, notBlank]],
    email: '',
    firstname: '',
    lastname: '',
  });
  protected posts: Post[] = [];

  protected currentUser: User | null = null;
  protected editMode = false;
  protected loadFailed = false;
  protected readonly pending = signal(false);

  ngOnInit(): void {
    this.getUser();
  }

  protected getUser(): void {
    this.loadFailed = false;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.fetchPosts();
      },
      error: () => (this.loadFailed = true),
    });
  }

  protected fetchPosts(): void {
    this.postService.getCurrentUserPosts().subscribe({
      next: (posts) => (this.posts = posts),
      error: () =>
        this.notifications.show("Couldn't load your posts. Try again later."),
    });
  }

  protected startEditing(user: User): void {
    this.editProfileForm.reset({
      username: user.username ?? '',
      email: user.email,
      firstname: user.firstname ?? '',
      lastname: user.lastname ?? '',
    });
    this.editMode = true;
  }

  protected cancelEditing(): void {
    this.editMode = false;
  }

  protected updateProfile(user: User): void {
    if (this.editProfileForm.invalid) {
      this.editProfileForm.markAllAsTouched();
      return;
    }

    const update = { ...this.editProfileForm.getRawValue(), id: user.id };
    this.pending.set(true);
    this.userService.updateUser(user.id, update).subscribe({
      next: () => {
        this.pending.set(false);
        this.currentUser = { ...user, ...update };
        this.editMode = false;
        this.notifications.show('Profile updated');
      },
      error: () => {
        this.pending.set(false);
        this.notifications.show("Couldn't update your profile. Try again.");
      },
    });
  }
}
