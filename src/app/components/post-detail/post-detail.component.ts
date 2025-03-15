import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  standalone: true,
  imports: [CommentListComponent, DatePipe],
})
export class PostDetailComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly postService: PostService = inject(PostService);

  protected post!: Post;
  protected postID: string | null = String(
    this.route.snapshot.paramMap.get('id'),
  );

  ngOnInit(): void {
    this.getPost();
  }

  protected getPost() {
    if (this.postID != null) {
      this.postService.fetchPostByID(this.postID).subscribe((data: Post) => {
        this.post = data;
      });
    }
  }
}
