import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss'],
    standalone: false
})
export class PostListComponent implements OnInit {
  @Input() searchTerm!: string;

  posts!: Post[];
  filteredList!: Post[];
  searchResults!: Post[];
  subscription!: Subscription;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.subscription = this.postService
      .fetchPosts()
      .subscribe((response: Post[]) => {
        this.posts = response;
      });
  }

  searchBar() {
    if (this.searchTerm.length > 0) {
      this.posts = this.posts.filter((post) => {
        return post.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    } else {
      this.searchResults = [];
      this.posts = [];
      this.getPosts();
    }
  }

}
