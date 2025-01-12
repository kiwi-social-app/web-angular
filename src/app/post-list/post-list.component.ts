import { identifierName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { DataService, Post } from '../services/data.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  providers: [DataService],
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts() {
    this.dataService.getAllPosts().subscribe((data) => {
      data.forEach((element: any) => {
        this.posts.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
    });
  }
}
