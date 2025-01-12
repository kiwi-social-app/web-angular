import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  providers: [DataService],
})
export class PostListComponent implements OnInit {
  posts: any = [];
  author!: any;
  authorData!: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.dataService.getAllPosts().subscribe((data) => {
      data.forEach(async (element: any) => {
        this.author = await this.getAuthor(element.payload.doc.data().userID);
        this.posts.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
          author: this.author,
        });
      });
    });
  }

  async getAuthor(userID: string): Promise<string> {
    this.authorData = await this.dataService.getPostAuthor(userID);
    return this.authorData.username;
  }
}
