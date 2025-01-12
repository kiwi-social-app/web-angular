import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';

import { DataService, Post } from '../data.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  public post!: Post | undefined;
  public posts: Post[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    this.getPost();
  }

  getPost() {
    return this.dataService
      .getAllPosts()
      .pipe(map((res) => res))
      .subscribe((posts: any) => {
        const id = String(this.route.snapshot.paramMap.get('id'));
        this.post = posts.find((post: any) => post.id === id);

        console.log(this.post);
      });
  }

  goBack(): void {
    this.location.back();
  }
}
