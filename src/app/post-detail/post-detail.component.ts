import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { DataService } from '../services/data.service';
import { Post } from '../services/post.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  public post!: Post;
  public posts: Post[] | undefined;
  public id!: string | null;
  public author!: any;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dataService: DataService
  ) {
    this.id = String(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getPost();
  }

  getPost() {
    if (this.id != null) {
      this.dataService.getPostByID(this.id).then((data: any) => {
        this.post = data;
        this.getAuthor(this.post.userID);
      });
    }
  }

  getAuthor(userID: string) {
    if (this.id != null) {
      this.dataService.getPostAuthor(userID).then((authorData: any) => {
        this.author = authorData.username;
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
