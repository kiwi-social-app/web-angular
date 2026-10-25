import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { confirmPostDeletion } from '../modals/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class UserPostsComponent {
  @Input() userPosts!: Post[];
  @Output() onPostChange: EventEmitter<Comment> = new EventEmitter();

  private readonly postService: PostService = inject(PostService);
  private readonly router: Router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected deletePost(postID: string) {
    confirmPostDeletion(this.dialog)
      .pipe(
        filter(Boolean),
        switchMap(() => this.postService.deletePost(postID)),
      )
      .subscribe((response) => this.onPostChange.emit(response));
  }

  protected editPost(postID: string) {
    this.router.navigate([`/post-edit/${postID}`]);
  }
}
