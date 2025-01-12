import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Post } from '../services/post.model';
import { ɵisAnalyticsSupportedFactory } from '@angular/fire';

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

  checkImageUrl(url: any) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send();
    request.onload = function () {
      if (request.status == 200) {
        //if(statusText == OK)
        console.log('image exists');
      } else {
        console.log("image doesn't exist");
      }
    };
  }
}
