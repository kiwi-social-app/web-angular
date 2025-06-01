import {
  Component,
  computed,
  inject,
  resource,
  ResourceRef,
  Signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PostService } from 'src/app/services/post.service';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { NewCommentComponent } from '../new-comment/new-comment.component';
import { CommentService } from '../../services/comment.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  standalone: true,
  imports: [CommentListComponent, DatePipe, MatIcon, NewCommentComponent],
})
export class PostDetailComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly postService: PostService = inject(PostService);
  private readonly commentService: CommentService = inject(CommentService);

  readonly postID: Signal<string> = computed(
    () => this.route.snapshot.paramMap.get('id') ?? '',
  );
  readonly post: ResourceRef<Post | undefined> = resource({
    loader: () => firstValueFrom(this.postService.getPostByID(this.postID())),
  });

  readonly comments: ResourceRef<Comment[] | undefined> = resource({
    params: () => ({
      id: this.postID(),
    }),
    loader: ({ params }) => {
      return firstValueFrom(
        this.commentService.fetchCommentsByPostID(params.id),
      );
    },
  });

  protected replyInput = false;

  protected onReplyInputDisplayChange() {
    this.replyInput = !this.replyInput;
  }

  protected handleNewComment(): void {
    this.comments.reload();
  }
}
