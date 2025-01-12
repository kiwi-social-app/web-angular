import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { DataService, Post } from '../data.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  public post!: Post;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getPost();
  }

  getPost() {
    const id = String(this.route.snapshot.paramMap.get('id'));
    return this.dataService.getPostByID(id).subscribe((response: any) => {
      this.post = response[0];
    });
  }

  goBack(): void {
    this.location.back();
  }
}
