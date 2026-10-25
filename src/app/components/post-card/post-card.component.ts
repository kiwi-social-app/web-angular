import {
  Component,
  inject,
  Input,
  OnInit,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { filter, switchMap, take } from 'rxjs';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';
import { AvatarComponent } from '../avatar/avatar.component';
import { confirmPostDeletion } from '../modals/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AvatarComponent,
    DatePipe,
    MatButton,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatTooltip,
    RelativeTimePipe,
    RouterLink,
  ],
})
export class PostCardComponent implements OnInit {
  @Input() post!: Post;
  @Input() currentUserId?: string;
  readonly deleted = output<string>();

  private readonly postService: PostService = inject(PostService);
  private readonly dialog = inject(MatDialog);

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

  protected get isOwner(): boolean {
    return !!this.currentUserId && this.currentUserId === this.post.author.id;
  }

  protected deletePost(): void {
    confirmPostDeletion(this.dialog)
      .pipe(
        filter(Boolean),
        switchMap(() => this.postService.deletePost(this.post.id)),
      )
      .subscribe(() => this.deleted.emit(this.post.id));
  }

  protected addToFavorites(postId: string): void {
    this.postService
      .favoritePost(postId)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.status === 204) {
            this.isFavorite = true;
          }
        },
        error: (err) => {
          console.error('❌ Error favoriting post:', err);
        },
      });
  }

  protected removeFromFavorites(postId: string): void {
    this.postService
      .unfavoritePost(postId)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.status === 204) {
            this.isFavorite = false;
          }
        },
        error: (err) => {
          console.error('❌ Error removing post from favorites:', err);
        },
      });
  }

  protected addLike(postId: string): void {
    this.postService
      .addLike(postId)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.status === 204) {
            this.isLiked = true;
            this.isDisliked = false;
          }
        },
        error: (err) => {
          console.error('❌ Error liking post:', err);
        },
      });
  }

  protected addDislike(postId: string): void {
    this.postService
      .addDislike(postId)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.status === 204) {
            this.isDisliked = true;
            this.isLiked = false;
          }
        },
        error: (err) => {
          console.error('❌ Error disliking post:', err);
        },
      });
  }

  protected removeLike(postId: string): void {
    this.postService
      .removeLike(postId)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.status === 204) {
            this.isLiked = false;
          }
        },
        error: (err) => {
          console.error('❌ Error removing post from liked posts:', err);
        },
      });
  }

  protected removeDislike(postId: string): void {
    this.postService
      .removeDislike(postId)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.status === 204) {
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
