import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Post } from '../../models/post.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostCardComponent } from '../post-card/post-card.component';
import { MatButton } from '@angular/material/button';
import { UserUpdate } from '../../models/userUpdate.model';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { StateMessageComponent } from '../state-message/state-message.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LoadingStateComponent,
    MatButton,
    PostCardComponent,
    ReactiveFormsModule,
    StateMessageComponent,
  ],
})
export class DashboardComponent implements OnInit {
  @Output() onUpdateProfile: EventEmitter<User> = new EventEmitter();

  private readonly userService: UserService = inject(UserService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly postService: PostService = inject(PostService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly notifications = inject(NotificationService);

  protected editProfileForm!: FormGroup;
  protected posts: Post[] = [];

  protected currentUser!: any;
  protected updatedUser!: UserUpdate;
  protected editMode: boolean = false;
  protected loadFailed = false;

  ngOnInit(): void {
    this.getUser();
  }

  protected initialiseForm(): void {
    this.editProfileForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required]],
      firstname: null,
      lastname: null,
    });
  }

  protected getUser(): void {
    this.loadFailed = false;
    this.authService
      .authState()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user) {
          this.userService.getUserByID(user.uid).subscribe({
            next: (userData: User) => {
              this.currentUser = userData;
              this.initialiseForm();
              this.editProfileForm.patchValue({
                username: userData.username,
                email: userData.email,
                firstname: userData.firstname,
                lastname: userData.lastname,
              });
            },
            error: () => (this.loadFailed = true),
          });
          this.fetchPosts();
        }
      });
  }

  protected fetchPosts(): void {
    this.postService.getCurrentUserPosts().subscribe({
      next: (posts) => (this.posts = posts),
      error: () =>
        this.notifications.show("Couldn't load your posts. Try again later."),
    });
  }

  protected updateProfile(): void {
    this.updatedUser = this.editProfileForm.getRawValue();
    this.userService
      .updateUser(this.currentUser.id, this.updatedUser)
      .subscribe({
        next: () => {
          this.currentUser = { ...this.currentUser, ...this.updatedUser };
          this.editMode = false;
          this.notifications.show('Profile updated');
        },
        error: () =>
          this.notifications.show("Couldn't update your profile. Try again."),
      });
  }

  protected editBtn(): void {
    this.editMode = !this.editMode;
    this.getUser();
  }
}
