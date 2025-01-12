import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { Post } from '../../models/post.model';
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
  public post: Post = {
    title: '',
    body: '',
    createdAt: null,
    userID: '',
    id: '',
    image: null,
  };
  public postID!: string | null;
  imageValidation: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private firestoreService: FirestoreService
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
      this.firestoreService.getPostByID(this.postID).then((data: any) => {
        this.post = data;
        this.initialiseForm();
      });
    }
  }

  updatePost() {
    if (this.postID != null) {
      this.updatedPost = this.updatePostForm.getRawValue();

      if (
        this.checkImageUrl(this.updatedPost.image) === true ||
        this.updatePostForm?.get('image')?.getRawValue().length === 0
      ) {
        this.imageValidation = true;
        this.firestoreService.updatePost(this.postID, this.updatedPost);
        // this.router.navigate(['/']);
      } else {
        this.imageValidation = false;
      }
    }
  }

  deletePost(postID: string) {
    this.firestoreService.deletePost(postID);
  }

  checkImageUrl(url: any): any {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send();
    request.onload = function () {
      if (request.status == 200) {
        console.log(`image exists`);
        return true;
      } else {
        console.log(`image doesn't exist`);
        return false;
      }
    };
  }
}
