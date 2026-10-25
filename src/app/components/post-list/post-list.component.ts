import {
  Component,
  computed,
  inject,
  resource,
  ResourceRef,
  Signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { PostCardComponent } from '../post-card/post-card.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NewPostModalComponent } from '../modals/new-post-modal/new-post-modal.component';
import { filter, firstValueFrom } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { formDialogConfig } from '../modals/dialog-config';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { StateMessageComponent } from '../state-message/state-message.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LoadingStateComponent,
    PostCardComponent,
    StateMessageComponent,
    MatButton,
    MatIcon,
    MatIconButton,
  ],
})
export class PostListComponent {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly postService: PostService = inject(PostService);
  private readonly userService: UserService = inject(UserService);

  protected readonly posts: ResourceRef<Post[] | undefined> = resource({
    loader: () => firstValueFrom(this.postService.getPosts()),
  });

  protected readonly currentUser: ResourceRef<User | null | undefined> =
    resource({
      loader: () => firstValueFrom(this.userService.getCurrentUser()),
    });

  protected readonly sortedPosts: Signal<Post[]> = computed(() => {
    if (!this.posts.hasValue()) {
      return [];
    }

    return this.posts
      .value()
      .toSorted(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  });

  protected openNewPostModal(): void {
    this.dialog
      .open<NewPostModalComponent, void, boolean>(
        NewPostModalComponent,
        formDialogConfig,
      )
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.posts.reload());
  }

  protected reload(): void {
    this.posts.reload();
    this.currentUser.reload();
  }

  protected filterSelect() {}
}
