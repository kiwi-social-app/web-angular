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
  newPost!: Post;
  success: boolean = false;
  imageValidation: boolean = true;

  ngOnInit() {
    this.initialiseForm();
  }

  protected initialiseForm(): void {
    this.newPostForm = this.fb.group({
      body: ['', [Validators.required]],
      image: '',
    });
  }

  protected createPost() {
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

  protected checkImageUrl(url: any): any {
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
