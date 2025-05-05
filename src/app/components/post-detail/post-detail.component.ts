import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Observable, of } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { NewCommentComponent } from '../new-comment/new-comment.component';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  standalone: true,
  imports: [
    CommentListComponent,
    DatePipe,
    AsyncPipe,
    MatIcon,
    NewCommentComponent,
  ],
})
export class PostDetailComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly postService: PostService = inject(PostService);
  private readonly userService: UserService = inject(UserService);
  private readonly commentService: CommentService = inject(CommentService);

  public comments$!: Observable<Comment[]>;
  protected post!: Post;
  protected postID: string | null = String(
    this.route.snapshot.paramMap.get('id'),
  );
  protected author: Observable<User | undefined> = of();
  protected replyInput = false;

  ngOnInit(): void {
    this.getPost();
    this.getComments();
  }

  protected getPost() {
    if (this.postID != null) {
      this.postService.fetchPostByID(this.postID).subscribe((data: Post) => {
        this.post = data;
        this.author = this.userService.getUserByID(this.post.authorId);
      });
    }
  }

  protected onReplyInputDisplayChange() {
    this.replyInput = !this.replyInput;
  }

  protected getComments(): void {
    if (this.postID) {
      this.comments$ = this.commentService.fetchCommentsByPostID(this.postID);
    }
  }
}
