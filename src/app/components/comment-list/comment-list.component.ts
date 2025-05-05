import { Component, input, InputSignal } from '@angular/core';
import { Comment } from '../../models/comment.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  standalone: true,
  imports: [DatePipe],
})
export class CommentListComponent {
  public postID: InputSignal<string> = input.required<string>();
  public comments: InputSignal<Comment[] | null> = input.required<
    Comment[] | null
  >();
}
