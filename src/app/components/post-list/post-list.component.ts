import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  providers: [FirestoreService],
})
export class PostListComponent implements OnInit {
  @Input() searchTerm!: string;

  posts: Post[] = [];
  filteredList!: Post[];
  searchResults: Post[] = [];
  subscription!: Subscription;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPosts() {
    this.subscription = this.postService
      .fetchPosts()
      .subscribe((response: Post[]) => {
        this.posts = response;
        this.sortPosts();
      });
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
