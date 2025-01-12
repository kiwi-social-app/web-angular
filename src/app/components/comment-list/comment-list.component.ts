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
        this.comments = response;
      });
  }

}
