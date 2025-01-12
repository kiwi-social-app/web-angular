import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { Post } from '../services/post.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss'],
})
export class PostEditComponent implements OnInit {
  @Output() onUpdatePost: EventEmitter<Post> = new EventEmitter();

  updatePostForm!: FormGroup;
  updatedPost!: any;
  public post!: Post;
  public postID!: string | null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.postID = String(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getPost();
  }

  initialiseForm(): void {
    this.updatePostForm = this.fb.group({
      title: [null, [Validators.required]],
      body: [null, [Validators.required]],
      image: null,
    });
  }

  getPost() {
    if (this.postID != null) {
      this.dataService.getPostByID(this.postID).then((data: any) => {
        this.post = data;
        this.initialiseForm();
      });
    }
  }

  updatePost() {
    if (this.postID != null) {
      this.updatedPost = this.updatePostForm.getRawValue();
      this.dataService.updatePost(this.postID, this.updatedPost);
    }
  }


  deletePost(postID: string) {
    this.dataService.deletePost(postID);
  }
}
