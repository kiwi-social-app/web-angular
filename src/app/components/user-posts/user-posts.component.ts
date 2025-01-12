import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss'],
})
export class UserPostsComponent implements OnInit {
  @Input() posts!: any;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {}

  deletePost(postID: string) {
    console.log(postID);
    this.postService.deletePost(postID).subscribe((response: any) => {
      console.log(response);
    });
  }
  editPost(postID: string) {
    this.router.navigate([`/post-edit/${postID}`]);
  }
}
