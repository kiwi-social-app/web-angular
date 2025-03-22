import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';
import { PostCreation } from '../../models/postCreation.model';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class NewPostComponent implements OnInit {
  private readonly postService: PostService = inject(PostService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);

  @Output() onNewPost: EventEmitter<Post> = new EventEmitter();

  newPostForm!: FormGroup;
  newPost!: PostCreation;
  success: boolean = false;

  ngOnInit() {
    this.initialiseForm();
  }

  protected initialiseForm(): void {
    this.newPostForm = this.fb.group({
      body: ['', [Validators.required]],
    });
  }

  protected createPost() {
    this.newPost = this.newPostForm.getRawValue();
    console.log(this.newPost);

    this.postService.createPost(this.newPost).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }
}
