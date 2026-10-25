import {
  Component,
  computed,
  inject,
  resource,
  ResourceRef,
  Signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { MatButton } from '@angular/material/button';
import { PostCardComponent } from '../post-card/post-card.component';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { StateMessageComponent } from '../state-message/state-message.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LoadingStateComponent,
    MatButton,
    PostCardComponent,
    StateMessageComponent,
  ],
})
export class UserProfileComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly userService: UserService = inject(UserService);
  private readonly postService: PostService = inject(PostService);

  private readonly userId: Signal<string> = computed(
    () => this.route.snapshot.paramMap.get('id') ?? '',
  );

  protected readonly user: ResourceRef<User | undefined> = resource({
    params: () => ({ id: this.userId() }),
    loader: ({ params }) =>
      firstValueFrom(this.userService.getUserByID(params.id)),
  });

  private readonly viewer = resource({
    loader: () => firstValueFrom(this.userService.getCurrentUser()),
  });

  protected readonly viewerId = computed(() =>
    this.viewer.hasValue() ? this.viewer.value()?.id : undefined,
  );

  protected readonly posts: ResourceRef<Post[] | undefined> = resource({
    params: () => ({ id: this.userId() }),
    loader: ({ params }) =>
      firstValueFrom(this.postService.getPostsByUser(params.id)),
  });
}
