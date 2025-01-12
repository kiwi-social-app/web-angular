import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

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
  imageValidation: boolean = true;

  constructor(
    private postService: PostService,
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
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      image: '',
    });
  }

  createPost() {
    this.newPost = this.newPostForm.getRawValue();
    if (
      this.checkImageUrl(this.newPost.image) === true ||
      this.newPostForm?.get('image')?.getRawValue().length === 0
    ) {
      this.postService.createPost(this.newPost).subscribe((response) => {
        this.router.navigate(['/']);
      });
    } else {
      this.imageValidation = false;
    }
  }


  checkImageUrl(url: any): any {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send();
    request.onload = function () {
      if (request.status == 200) {
        console.log(`image exists`);
        return true;
      } else {
        console.log(`image doesn't exist`);
        return false;
      }
    };
  }
}
