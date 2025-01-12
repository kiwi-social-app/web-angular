import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodejsService } from 'src/app/services/nodejs.service';
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
  author!: string;
  authorData!: any;
  filteredList!: Post[];
  searchResults: Post[] = [];
  subscription!: Subscription;

  constructor(private nodejsService: NodejsService, private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.getPosts();
    this.getNodePosts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getNodePosts(){
    this.nodejsService.fetchPosts().subscribe((response: Post[]) => {
      console.log(response)
      this.posts = response;
    })
  }

  getPosts() {
    this.subscription = this.firestoreService
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
    this.authorData = await this.firestoreService.getPostAuthor(userID);
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
