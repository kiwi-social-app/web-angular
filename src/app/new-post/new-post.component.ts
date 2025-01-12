import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../services/data.service';
import { Post } from '../services/post.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../services/user.model';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  @Output() onNewPost: EventEmitter<Post> = new EventEmitter();

  newPostForm!: FormGroup;
  currentUser!: User;
  newPost!: Post;
  loading: boolean = false;
  success: boolean = false;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router,
    public auth: AuthService
  ) {
    this.currentUser = this.auth.getCurrentUser();
  }

  ngOnInit() {
    this.initialiseForm();
  }

  initialiseForm(): void {
    this.newPostForm = this.fb.group({
      title: [null, [Validators.required]],
      body: [null, [Validators.required]],
      image: null,
    });
  }

  createPost() {
    this.newPost = this.newPostForm.getRawValue();
    this.dataService.createPost(this.newPost);
    this.router.navigate(['/']);
  }
}
