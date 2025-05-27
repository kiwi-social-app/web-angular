import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  imports: [MatIcon],
})
export class PostCardComponent implements OnInit {
  @Input() post!: Post;
  @Input() currentUserId?: string;

  private readonly postService: PostService = inject(PostService);
  private readonly router: Router = inject(Router);

  protected author: Observable<User | undefined> = of();
  protected isFavorite: boolean = false;
  protected isLiked: boolean = false;
  protected isDisliked: boolean = false;

  ngOnInit(): void {
    if (this.currentUserId) {
      this.isFavorite = this.checkIfFavorite(this.currentUserId);
      this.isLiked = this.checkIfLiked(this.currentUserId);
      this.isDisliked = this.checkIfDisliked(this.currentUserId);
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

  protected addLike(postId: string, userId: string): void {
    this.postService
      .addLike(postId, userId)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.status === 204) {
            console.log('✅ Post successfully liked (204 No Content)');
            if (!this.post.likedByUsers.includes(userId)) {
              this.post.likedByUsers.push(userId);
            }
            this.isLiked = true;
            this.isDisliked = false;
          }
        },
        error: (err) => {
          console.error('❌ Error liking post:', err);
        },
      });
  }

  protected addDislike(postId: string, userId: string): void {
    this.postService
      .addDislike(postId, userId)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.status === 204) {
            console.log('✅ Post successfully disliked (204 No Content)');
            if (!this.post.dislikedByUsers.includes(userId)) {
              this.post.dislikedByUsers.push(userId);
            }
            this.isDisliked = true;
            this.isLiked = false;
          }
        },
        error: (err) => {
          console.error('❌ Error disliking post:', err);
        },
      });
  }

  protected removeLike(postId: string, userId: string): void {
    this.postService
      .removeLike(postId, userId)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.status === 204) {
            console.log(
              '✅ Post successfully removed from liked posts (204 No Content)',
            );
            if (!this.post.likedByUsers.includes(userId)) {
              this.post.likedByUsers.filter((id) => id !== userId);
            }
            this.isLiked = false;
          }
        },
        error: (err) => {
          console.error('❌ Error removing post from liked posts:', err);
        },
      });
  }

  protected removeDislike(postId: string, userId: string): void {
    this.postService
      .removeDislike(postId, userId)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.status === 204) {
            console.log(
              '✅ Post successfully removed from disliked posts (204 No Content)',
            );
            if (!this.post.dislikedByUsers.includes(userId)) {
              this.post.dislikedByUsers.filter((id) => id !== userId);
            }
            this.isDisliked = false;
          }
        },
        error: (err) => {
          console.error('❌ Error removing post from disliked posts:', err);
        },
      });
  }

  private checkIfFavorite(currentUserId: string): boolean {
    return this.post.favoritedBy.includes(currentUserId);
  }

  private checkIfLiked(currentUserId: string): boolean {
    return this.post.likedByUsers.includes(currentUserId);
  }

  private checkIfDisliked(currentUserId: string): boolean {
    return this.post.dislikedByUsers.includes(currentUserId);
  }
}
