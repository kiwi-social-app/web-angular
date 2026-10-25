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
import { NotificationService } from '../../services/notification.service';
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
  private readonly notifications = inject(NotificationService);

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
      .subscribe({
        next: () => this.deleted.emit(this.post.id),
        error: () =>
          this.notifications.show("Couldn't delete the post. Try again."),
      });
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
        error: () =>
          this.notifications.show("Couldn't save the post. Try again."),
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
        error: () =>
          this.notifications.show(
            "Couldn't remove the post from your saved posts. Try again.",
          ),
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
        error: () =>
          this.notifications.show("Couldn't like the post. Try again."),
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
        error: () =>
          this.notifications.show("Couldn't dislike the post. Try again."),
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
        error: () =>
          this.notifications.show("Couldn't remove your like. Try again."),
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
        error: () =>
          this.notifications.show("Couldn't remove your dislike. Try again."),
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
