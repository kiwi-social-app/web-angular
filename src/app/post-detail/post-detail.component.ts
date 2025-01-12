import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';

import { DataService, Post } from '../services/data.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  public post!: Post | undefined;
  public posts: Post[] | undefined;
  public id!: string | null;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dataService: DataService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getPost();
  }

  getPost() {
    if (this.id != null) {
      this.dataService.getPostByID(this.id).then((data: any) => {
        console.log(data);
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
