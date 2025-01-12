import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit {
  comments: any[] = [];
  public postID: string;
  public author!: any;
  authorData!: any;
  subscription!: Subscription;

  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute
  ) {
    this.postID = String(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getComments();
  }

  getComments() {
    this.commentService
      .fetchCommentsByPostID(this.postID)
      .subscribe((response) => {
        return response.forEach((comment) => this.buildComments(comment));
      });
  }

  async buildComments(comment: any) {
    if (
      comment.postID === this.postID &&
      !this.comments.some((e) => e.id === comment.id)
    ) {
      await this.commentService
        .getCommentAuthor(comment.userID)
        .subscribe((response) => {
          this.author = response.username;
          this.comments.push({ author: this.author, ...comment });
        });
    }
  }
}
