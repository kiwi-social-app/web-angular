import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Post } from '../../models/post.model';
import { Subscription } from 'rxjs';

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
  subscription!: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPosts() {
    this.subscription = this.dataService
      .fetchPosts()

      .subscribe((response) => {
        this.buildPosts(response);
      });
  }

  async buildPosts(response: any) {
    if (!this.posts.some((e) => e.id === response.id)) {
      this.author = await this.getAuthor(response.userID);

      this.posts.push({
        ...response,
        author: this.author,
      });
    }
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
