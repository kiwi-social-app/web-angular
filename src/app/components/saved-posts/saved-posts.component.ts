import {
  Component,
  effect,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { PostCardComponent } from '../post-card/post-card.component';
import { RouterLink } from '@angular/router';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-saved-posts',
  templateUrl: './saved-posts.component.html',
  styleUrl: './saved-posts.component.scss',
  standalone: true,
  imports: [PostCardComponent, RouterLink],
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
      const userId = this.currentUser()?.id;
      if (!userId) return;

      this.postService.getUserFavorites(userId).subscribe({
        next: (posts) => this.favoritePosts.set(posts),
        error: (err) => console.error('Failed to load favorites', err),
      });
    });
  }
}
