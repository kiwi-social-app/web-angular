import {
  ChangeDetectionStrategy,
  Component,
  inject,
  resource,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { PostCardComponent } from '../post-card/post-card.component';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { StateMessageComponent } from '../state-message/state-message.component';

@Component({
  selector: 'app-saved-posts',
  templateUrl: './saved-posts.component.html',
  styleUrl: './saved-posts.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LoadingStateComponent,
    MatButton,
    PostCardComponent,
    StateMessageComponent,
  ],
})
export class SavedPostsComponent {
  private readonly userService = inject(UserService);
  private readonly postService = inject(PostService);

  protected readonly currentUser = resource({
    loader: () => firstValueFrom(this.userService.getCurrentUser()),
  });

  protected readonly favorites = resource({
    loader: () => firstValueFrom(this.postService.getUserFavorites()),
  });

  protected reload(): void {
    this.currentUser.reload();
    this.favorites.reload();
  }

  protected removeFavorite(postId: string): void {
    this.favorites.update((posts) =>
      posts?.filter((post) => post.id !== postId),
    );
  }
}
