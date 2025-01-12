import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  providers: [DataService],
})
export class PostListComponent implements OnInit {
  @Input() searchTerm!: string;

  posts: Post[] = [];
  author!: string;
  authorData!: any;
  filteredList!: Post[];
  searchResults: Post[] = [];

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
        this.sortPosts();
      });
    });
  }

  async getAuthor(userID: string): Promise<string> {
    this.authorData = await this.dataService.getPostAuthor(userID);
    return this.authorData.username;
  }

  searchBar() {
    if (this.searchTerm.length > 0) {
      this.posts = this.posts.filter((post) => {
        return post.title.includes(this.searchTerm);
      });
    } else {
      this.searchResults = [];
      this.posts = [];
      this.getPosts();
    }
  }

  sortPosts() {
    this.posts.sort((a: Post, b: Post) => {
      return b.createdAt.valueOf() - a.createdAt.valueOf();
    });
  }

}
