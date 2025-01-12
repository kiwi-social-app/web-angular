import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss'],
})
export class UserPostsComponent implements OnInit {
  @Input() posts!: any;

  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  deletePost(postID: string) {
    this.firestoreService.deletePost(postID);
  }
  editPost(postID: string) {
    this.router.navigate([`/post-edit/${postID}`]);
  }
}
