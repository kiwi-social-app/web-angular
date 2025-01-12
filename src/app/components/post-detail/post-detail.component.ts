import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NodejsService } from 'src/app/services/nodejs.service';
import { Post } from '../../models/post.model';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  public post: Post = {
    title: '',
    body: '',
    createdAt: null,
    userID: '',
    id: '',
    image: null,
  };
  public postID!: string | null;
  public author!: any;

  constructor(
    private route: ActivatedRoute,
    private nodejsService: NodejsService,
    private firestoreService: FirestoreService
  ) {
    this.postID = String(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getPost();
    this.getPostNode();
  }

  getPost() {
    if (this.postID != null) {
      this.firestoreService.getPostByID(this.postID).then((data: any) => {
        this.post = data;
        this.getAuthor(this.post.userID);
      });
    }
  }

  getPostNode() {
    if (this.postID != null) {
      this.nodejsService.fetchPostByID(this.postID).subscribe((data: any) => {
        this.post = data;
        this.getAuthor(this.post.userID);
      });
    }
  }

  getAuthor(userID: string) {
    if (this.postID != null) {
      this.firestoreService.getPostAuthor(userID).then((authorData: any) => {
        this.author = authorData.username;
      });
    }
  }
}
