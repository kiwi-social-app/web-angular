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
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class PostEditComponent implements OnInit {
  @Output() onUpdatePost: EventEmitter<Post> = new EventEmitter();

  private readonly postService: PostService = inject(PostService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected updatePostForm!: FormGroup;
  protected updatedPost!: any;
  public post!: Post;
  public postID: string | null = String(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void {
    this.getPost();
  }

  protected initialiseForm(): void {
    this.updatePostForm = this.fb.group({
      body: [null, [Validators.required]],
    });
  }

  protected getPost() {
    if (this.postID != null) {
      this.postService.fetchPostByID(this.postID).subscribe((post: any) => {
        this.post = post;
        this.initialiseForm();
        this.updatePostForm.patchValue({ body: post.body });
      });
    }
  }

  protected updatePost() {
    if (this.postID != null) {
      this.updatedPost = { ...this.post, ...this.updatePostForm.getRawValue() };
      this.postService
        .updatePost(this.updatedPost)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((response: any) => response);
    }
  }

  protected deletePost(postID: string) {
    this.postService.deletePost(postID).subscribe((response: any) => {
      this.router.navigate(['/']);
    });
  }
}
