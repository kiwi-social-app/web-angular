import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  resource,
  ResourceRef,
  signal,
} from '@angular/core';
import { PostService } from '../../services/post.service';
import { SemanticSearchService } from '../../services/semantic-search.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Post } from '../../models/post.model';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  forkJoin,
  map,
  of,
  switchMap,
} from 'rxjs';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { PostCardComponent } from '../post-card/post-card.component';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  imports: [
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    PostCardComponent,
    RouterLink,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  private readonly postService: PostService = inject(PostService);
  private readonly semanticSearchService: SemanticSearchService = inject(
    SemanticSearchService,
  );
  private readonly userService: UserService = inject(UserService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  searchControl = new FormControl('');
  searchResults = signal<Post[]>([]);

  protected readonly currentUser: ResourceRef<User | null | undefined> =
    resource({
      loader: () => firstValueFrom(this.userService.getCurrentUser()),
    });

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query || query.trim() === '') {
            return of([]);
          }
          return this.semanticSearchService.search(query);
        }),
        switchMap((results) => {
          const ids = results
            .map((result) => result.postId)
            .filter((id): id is string => !!id);
          if (ids.length === 0) return of([] as Post[]);
          return forkJoin(
            ids.map((id) =>
              this.postService.getPostByID(id).pipe(catchError(() => of(null))),
            ),
          ).pipe(map((posts) => posts.filter((p): p is Post => p !== null)));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.searchResults.set(data);
      });
  }
}
