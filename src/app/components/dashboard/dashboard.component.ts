import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/models/post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Output() onUpdateProfile: EventEmitter<User> = new EventEmitter();

  editProfileForm!: FormGroup;
  users: User[] = [];
  posts: Post[] = [];

  currentUser!: any;
  updatedUser!: User;
  editMode: boolean = false;
  subscription!: Subscription;

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initialiseForm(): void {
    this.editProfileForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required]],
      firstname: null,
      lastname: null,
    });
  }

  getUser() {
    this.subscription = this.auth.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUser = this.firestoreService
          .getUserData(user.uid)
          .then((userData: any) => {
            this.currentUser = userData;
            this.initialiseForm();

            this.firestoreService.fetchPosts().subscribe((response) => {
              this.buildPosts(response);
            });
          });
      }
    });
  }

  async buildPosts(response: any) {
    if (
      response.userID === this.currentUser.uid &&
      !this.posts.some((e) => e.id === response.id)
    ) {
      this.posts.push({
        ...response,
      });
    }
  }

  updateProfile() {
    this.updatedUser = this.editProfileForm.getRawValue();
    this.firestoreService.updateUser(this.currentUser.uid, this.updatedUser);
  }

  editBtn() {
    if (!this.editMode) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
  }

  sortPosts() {
    this.posts.sort((a: any, b: any) => {
      return b.createdAt.valueOf() - a.createdAt.valueOf();
    });
  }
}
