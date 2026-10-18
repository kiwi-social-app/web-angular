import {
  Component,
  input,
  InputSignal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Comment } from '../../models/comment.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePipe, RouterLink],
})
export class CommentListComponent {
  public postID: InputSignal<string> = input.required<string>();
  public comments: InputSignal<Comment[] | null> = input.required<
    Comment[] | null
  >();
}
