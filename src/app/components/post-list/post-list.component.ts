import {
  Component,
  computed,
  inject,
  resource,
  ResourceRef,
  Signal,
} from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';
import { PostCardComponent } from '../post-card/post-card.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewPostModalComponent } from '../modals/new-post-modal/new-post-modal.component';
import { firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  standalone: true,
  imports: [PostCardComponent, RouterLink, FormsModule, MatButton],
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
    let posts: Post[] | undefined = this.posts.value();
    if (!posts) {
      return [];
    }
    return posts.toSorted(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });

  protected openNewPostModal() {
    const dialogRef: MatDialogRef<NewPostModalComponent> = this.dialog.open(
      NewPostModalComponent,
      {
        data: {},
        height: '40rem',
        width: '30rem',
      },
    );

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.postService.createPost(result).subscribe(() => {
            this.posts.reload();
          });
        }
      });
  }
}
