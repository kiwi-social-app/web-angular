import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataService } from '../services/data.service';
import { User } from '../services/user.model';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Output() onUpdateProfile: EventEmitter<User> = new EventEmitter();

  editProfileForm!: FormGroup;
  users: User[] = [];
  posts: any = [];

  currentUser!: any;
  updatedUser!: User;
  editMode: boolean = false;

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getUser();
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
    this.auth.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUser = this.dataService
          .getUserData(user.uid)
          .then((userData: any) => {
            this.currentUser = userData;
            this.initialiseForm();

            this.dataService.getAllPosts().subscribe((data) => {
              data.forEach(async (element: any) => {
                if (element.payload.doc.data().userID === this.currentUser.uid) {
                  this.posts.push({
                    id: element.payload.doc.id,
                    ...element.payload.doc.data(),
                  });
                }
              });
            });
          });
      }
    });
  }

  updateProfile() {
    this.updatedUser = this.editProfileForm.getRawValue();
    this.dataService.updateUser(this.currentUser.uid, this.updatedUser);
  }

  editBtn() {
    if (!this.editMode) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
  }
}
