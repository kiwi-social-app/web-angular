import {
  Component,
  computed,
  inject,
  resource,
  ResourceRef,
  Signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PostService } from '../../services/post.service';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { AvatarComponent } from '../avatar/avatar.component';
import { MatIcon } from '@angular/material/icon';
import { NewCommentComponent } from '../new-comment/new-comment.component';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { StateMessageComponent } from '../state-message/state-message.component';
import { CommentService } from '../../services/comment.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AvatarComponent,
    MatButton,
    CommentListComponent,
    DatePipe,
    LoadingStateComponent,
    MatIcon,
    NewCommentComponent,
    RouterLink,
    StateMessageComponent,
  ],
})
export class PostDetailComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly postService: PostService = inject(PostService);
  private readonly commentService: CommentService = inject(CommentService);

  private readonly postID: Signal<string> = computed(
    () => this.route.snapshot.paramMap.get('id') ?? '',
  );
  protected readonly post: ResourceRef<Post | undefined> = resource({
    loader: () => firstValueFrom(this.postService.getPostByID(this.postID())),
  });

  protected readonly comments: ResourceRef<Comment[] | undefined> = resource({
    params: () => ({
      id: this.postID(),
    }),
    loader: ({ params }) => {
      return firstValueFrom(
        this.commentService.fetchCommentsByPostID(params.id),
      );
    },
  });

  protected readonly sortedComments: Signal<Comment[]> = computed(() => {
    if (!this.comments.hasValue()) return [];
    return this.comments
      .value()
      .toSorted(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  });

  protected replyInput = false;

  protected onReplyInputDisplayChange() {
    this.replyInput = !this.replyInput;
  }

  protected reload(): void {
    this.post.reload();
    this.comments.reload();
  }

  protected handleNewComment(): void {
    this.comments.reload();
  }
}
