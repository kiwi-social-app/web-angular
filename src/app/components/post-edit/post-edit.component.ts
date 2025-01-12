import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
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
  public post!: Post;
  public postID!: string | null;
  imageValidation: boolean = true;

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
        console.log(this.post)
        console.log(this.post.image?.length)
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
        this.dataService.updatePost(this.postID, this.updatedPost);
        // this.router.navigate(['/']);
      } else {
        this.imageValidation = false;
      }
    }
  }

  deletePost(postID: string) {
    this.dataService.deletePost(postID);
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
