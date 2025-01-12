import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss'],
})
export class UserPostsComponent implements OnInit {
  @Input() posts!: any;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {}

  deletePost(postID: string) {
    this.dataService.deletePost(postID);
  }
  editPost(postID: string) {
    this.router.navigate([`/post-edit/${postID}`]);
  }
}
