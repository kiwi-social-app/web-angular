import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from '../../models/comment.model';
import { NewCommentComponent } from '../new-comment/new-comment.component';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  standalone: true,
  imports: [NewCommentComponent, AsyncPipe, DatePipe],
})
export class CommentListComponent implements OnInit {
  private readonly commentService: CommentService = inject(CommentService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  public comments$!: Observable<Comment[]>;
  public postID: string = String(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void {
    this.getComments();
  }

  protected getComments(): void {
    this.comments$ = this.commentService.fetchCommentsByPostID(this.postID);
  }
}
