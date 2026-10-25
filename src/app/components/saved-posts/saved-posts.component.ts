import {
  Component,
  effect,
  inject,
  Signal,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { PostCardComponent } from '../post-card/post-card.component';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-saved-posts',
  templateUrl: './saved-posts.component.html',
  styleUrl: './saved-posts.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [PostCardComponent],
})
export class SavedPostsComponent {
  private userService: UserService = inject(UserService);
  private postService: PostService = inject(PostService);

  protected currentUser: Signal<User | null> = toSignal(
    this.userService.getCurrentUser(),
    {
      initialValue: null,
    },
  );

  protected favoritePosts: WritableSignal<Post[]> = signal<Post[]>([]);

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (!user) return;

      this.postService.getUserFavorites().subscribe({
        next: (posts) => this.favoritePosts.set(posts),
        error: (err) => console.error('Failed to load favorites', err),
      });
    });
  }

  protected removeFavorite(postId: string): void {
    this.favoritePosts.update((posts) =>
      posts.filter((post) => post.id !== postId),
    );
  }
}
