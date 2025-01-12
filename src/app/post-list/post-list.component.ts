import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Post } from '../services/post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  providers: [DataService],
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  public author!: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.dataService.getAllPosts().subscribe((data) => {
      data.forEach((element: any) => {
        this.posts.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
        this.getAuthor(element.payload.doc.data().userID);
      });
    });
  }
  getAuthor(userID: string) {
    this.dataService.getPostAuthor(userID).then((authorData: any) => {
      this.author = authorData.username;
    });
  }
}
