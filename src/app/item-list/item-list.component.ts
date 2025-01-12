import { Component, OnInit } from '@angular/core';
import { DataService, Post } from '../data.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  providers: [DataService]
})
export class ItemListComponent implements OnInit {
posts: Post[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchPosts();
  }

fetchPosts() {
  this.dataService.getAllPosts().subscribe(res => {
    this.posts = res;
  });
}


}
