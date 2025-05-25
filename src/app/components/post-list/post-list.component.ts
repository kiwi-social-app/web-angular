import { Component, inject, Signal } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { PostCardComponent } from '../post-card/post-card.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NewPostModalComponent } from '../modals/new-post-modal/new-post-modal.component';
import { take } from 'rxjs';

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

  protected posts: Signal<Post[] | undefined> = toSignal(
    this.postService.getPosts(),
  );

  protected currentUser: Signal<User | null | undefined> = toSignal(
    this.userService.getCurrentUser(),
  );

  protected openNewPostModal() {
    const dialogRef = this.dialog.open(NewPostModalComponent, {
      data: {},
      height: '40rem',
      width: '30rem',
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.postService.createPost(result).subscribe((response) => {});
        }
      });
  }
}
