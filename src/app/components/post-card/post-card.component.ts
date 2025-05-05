import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AsyncPipe } from '@angular/common';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { Observable, of } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  standalone: true,
  imports: [AsyncPipe, MatIcon],
})
export class PostCardComponent implements OnInit {
  @Input() post!: Post;

  private readonly userService: UserService = inject(UserService);
  private readonly router: Router = inject(Router);

  protected author: Observable<User | undefined> = of();

  ngOnInit(): void {
    this.author = this.userService.getUserByID(this.post.authorId);
  }

  protected goToPostDetail(): void {
    this.router.navigate([`/posts/${this.post.id}`]);
  }
}
