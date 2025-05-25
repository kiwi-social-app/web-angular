import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AsyncPipe } from '@angular/common';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { Observable, of, take } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  standalone: true,
  imports: [AsyncPipe, MatIcon],
})
export class PostCardComponent implements OnInit {
  @Input() post!: Post;
  @Input() currentUserId?: string;

  private readonly userService: UserService = inject(UserService);
  private readonly postService: PostService = inject(PostService);
  private readonly router: Router = inject(Router);

  protected author: Observable<User | undefined> = of();
  protected isFavorite: boolean = false;

  ngOnInit(): void {
    this.author = this.userService.getUserByID(this.post.authorId);

    if (this.currentUserId) {
      this.isFavorite = this.checkIfFavorite(this.currentUserId);
    }
  }

  protected goToPostDetail(postId: string): void {
    this.router.navigate([`/posts/`, postId]);
  }

  protected addToFavorites(postId: string, userId: string): void {
    this.postService
      .favoritePost(postId, userId)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.status === 204) {
            console.log('✅ Post successfully favorited (204 No Content)');
            if (!this.post.favoritedBy.includes(userId)) {
              this.post.favoritedBy.push(userId);
            }
            this.isFavorite = true;
          }
        },
        error: (err) => {
          console.error('❌ Error favoriting post:', err);
        },
      });
  }

  protected removeFromFavorites(postId: string, userId: string): void {
    this.postService
      .unfavoritePost(postId, userId)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.status === 204) {
            console.log(
              '✅ Post successfully removed from favorites (204 No Content)',
            );
            if (!this.post.favoritedBy.includes(userId)) {
              this.post.favoritedBy.filter((id) => id !== userId);
            }
            this.isFavorite = false;
          }
        },
        error: (err) => {
          console.error('❌ Error removing post from favorites:', err);
        },
      });
  }

  private checkIfFavorite(currentUserId: string): boolean {
    return this.post.favoritedBy.includes(currentUserId);
  }
}
