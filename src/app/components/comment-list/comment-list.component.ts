import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
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
  public postID: InputSignal<string> = input.required<string>();

  private readonly commentService: CommentService = inject(CommentService);

  public comments$!: Observable<Comment[]>;

  ngOnInit(): void {
    this.getComments();
  }

  protected getComments(): void {
    this.comments$ = this.commentService.fetchCommentsByPostID(this.postID());
  }
}
