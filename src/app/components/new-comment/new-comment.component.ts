import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from '../../models/comment.model';
import { Post } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss'],
})
export class NewCommentComponent implements OnInit {
  @Output() onNewComment: EventEmitter<Comment> = new EventEmitter();

  newCommentForm!: FormGroup;
  newComment!: Comment;
  public postID: string;

  currentUser!: any;
  currentPost!: Post;
  loading: boolean = false;
  success: boolean = false;
  userData!: any;

  constructor(
    private firestoreService: FirestoreService,
    private commentService: CommentService,
    private fb: FormBuilder,
    public auth: AuthService,
    private route: ActivatedRoute
  ) {
    this.postID = String(this.route.snapshot.paramMap.get('id'));
    this.currentUser = this.auth.getCurrentUser();
  }

  ngOnInit(): void {
    this.initialiseForm();
    this.auth.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
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
      .subscribe((response) => response);
  }
}
