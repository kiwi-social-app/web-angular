import { Component, inject, OnInit, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../models/user.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  standalone: true,
  imports: [CommentListComponent, DatePipe, AsyncPipe],
})
export class PostDetailComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly postService: PostService = inject(PostService);
  private readonly userService: UserService = inject(UserService);

  protected post!: Post;
  protected postID: string | null = String(
    this.route.snapshot.paramMap.get('id'),
  );

  protected author: Observable<User | undefined> = of();

  ngOnInit(): void {
    this.getPost();
  }

  protected getPost() {
    if (this.postID != null) {
      this.postService.fetchPostByID(this.postID).subscribe((data: Post) => {
        this.post = data;
        this.author = this.userService.getUserByID(this.post.authorId);
      });
    }
  }
}
