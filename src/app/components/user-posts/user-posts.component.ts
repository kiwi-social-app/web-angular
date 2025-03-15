import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss'],
  standalone: true,
})
export class UserPostsComponent {
  @Input() userPosts!: Post[];
  @Output() onPostChange: EventEmitter<Comment> = new EventEmitter();

  private readonly postService: PostService = inject(PostService);
  private readonly router: Router = inject(Router);

  protected deletePost(postID: string) {
    this.postService.deletePost(postID).subscribe((response: any) => {
      response;
      this.onPostChange.emit(response);
    });
  }

  protected editPost(postID: string) {
    this.router.navigate([`/post-edit/${postID}`]);
  }
}
