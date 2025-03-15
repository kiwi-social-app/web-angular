import { Component, inject, Signal } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { PostCardComponent } from '../post-card/post-card.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
}
