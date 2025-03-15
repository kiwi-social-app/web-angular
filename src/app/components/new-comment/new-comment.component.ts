import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from '../../models/comment.model';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase/compat';
import User = firebase.User;

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class NewCommentComponent implements OnInit {
  @Output() onNewComment: EventEmitter<Comment> = new EventEmitter();

  private readonly commentService: CommentService = inject(CommentService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  protected newCommentForm!: FormGroup;
  private newComment!: Comment;
  private postID: string = String(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void {
    this.initialiseForm();
  }

  initialiseForm(): void {
    this.newCommentForm = this.fb.group({
      body: [null, [Validators.required]],
    });
  }

  createComment() {
    this.newComment = this.newCommentForm.getRawValue();
    this.commentService
      .createComment(this.newComment, this.postID)
      .subscribe((response) => this.onNewComment.emit(response));
    this.newCommentForm.reset();
  }
}
