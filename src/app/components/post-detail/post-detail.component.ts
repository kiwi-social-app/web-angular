import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  public post!: Post;
  public postID!: string | null;
  public author!: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
    this.postID = String(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getPost();
  }

  getPost() {
    if (this.postID != null) {
      this.dataService.getPostByID(this.postID).then((data: any) => {
        this.post = data;
        this.getAuthor(this.post.userID);
      });
    }
  }

  getAuthor(userID: string) {
    if (this.postID != null) {
      this.dataService.getPostAuthor(userID).then((authorData: any) => {
        this.author = authorData.username;
      });
    }
  }

}
