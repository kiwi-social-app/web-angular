import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss'],
})
export class UserPostsComponent implements OnInit {
  @Input() userPosts!: Post[];

  constructor(private postService: PostService, private router: Router) {}
  @Output() onPostChange: EventEmitter<Comment> = new EventEmitter();

  ngOnInit(): void {}

  deletePost(postID: string) {
    this.postService.deletePost(postID).subscribe((response: any) => {
      response;
      this.onPostChange.emit(response);
    });
  }
  editPost(postID: string) {
    this.router.navigate([`/post-edit/${postID}`]);
  }
}
