import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { User } from '../services/user.model';
import { Post } from '../services/post.model';
import { Comment } from '../services/comment.model';
import { ActivatedRoute } from '@angular/router';

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

  currentUser!: User;
  currentPost!: Post;
  loading: boolean = false;
  success: boolean = false;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router,
    public auth: AuthService,
    private route: ActivatedRoute
  ) {
    this.postID = String(this.route.snapshot.paramMap.get('id'));
    this.currentUser = this.auth.getCurrentUser();
  }

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
    this.dataService.createComment(this.newComment, this.postID);
    this.router.navigate(['/']);
  }
}
