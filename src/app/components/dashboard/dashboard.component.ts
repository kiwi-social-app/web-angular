import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Post } from 'src/app/models/post.model';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserPostsComponent } from '../user-posts/user-posts.component';
import { MatButton } from '@angular/material/button';
import { UserUpdate } from '../../models/userUpdate.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [UserPostsComponent, ReactiveFormsModule, MatButton],
})
export class DashboardComponent implements OnInit {
  @Output() onUpdateProfile: EventEmitter<User> = new EventEmitter();

  private readonly userService: UserService = inject(UserService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected editProfileForm!: FormGroup;
  protected posts: Post[] = [];

  protected currentUser!: any;
  protected updatedUser!: UserUpdate;
  protected editMode: boolean = false;

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
    this.authService
      .authState()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user) {
          this.userService.getUserByID(user.uid).subscribe((userData: User) => {
            this.currentUser = userData;
            this.initialiseForm();
            this.editProfileForm.patchValue({
              username: userData.username,
              email: userData.email,
              firstname: userData.firstname,
              lastname: userData.lastname,
            });
          });
        }
      });
  }

  protected updateProfile(): void {
    this.updatedUser = this.editProfileForm.getRawValue();
    this.userService
      .updateUser(this.currentUser.id, this.updatedUser)
      .subscribe((response: any) => response);
  }

  protected editBtn(): void {
    this.editMode = !this.editMode;
    this.getUser();
  }

  protected signOut(): void {
    this.authService.signOut();
  }
}
