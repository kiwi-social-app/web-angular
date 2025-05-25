import { Component, inject, Signal } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { PostCardComponent } from '../post-card/post-card.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  standalone: true,
  imports: [PostCardComponent, RouterLink, FormsModule],
})
export class PostListComponent {
  protected posts: Signal<Post[] | undefined> = toSignal(
    inject(PostService).fetchPosts(),
  );

  protected currentUser: Signal<User | null | undefined> = toSignal(
    inject(UserService).getCurrentUser(),
  );
}
