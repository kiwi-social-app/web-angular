import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  resource,
  signal,
  ChangeDetectionStrategy,
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
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { PostCardComponent } from '../post-card/post-card.component';
import { UserService } from '../../services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { StateMessageComponent } from '../state-message/state-message.component';

type SearchStatus = 'idle' | 'loading' | 'done' | 'error';

@Component({
  selector: 'app-search',
  imports: [
    LoadingStateComponent,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    PostCardComponent,
    StateMessageComponent,
  ],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
  protected readonly status = signal<SearchStatus>('idle');

  private readonly currentUser = resource({
    loader: () => firstValueFrom(this.userService.getCurrentUser()),
  });

  protected readonly currentUserId = computed(() =>
    this.currentUser.hasValue() ? this.currentUser.value()?.id : undefined,
  );

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => this.status.set(query?.trim() ? 'loading' : 'idle')),
        switchMap((query) => {
          if (!query?.trim()) {
            return of([]);
          }
          return this.findPosts(query).pipe(
            tap(() => this.status.set('done')),
            catchError(() => {
              this.status.set('error');
              return of([]);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.searchResults.set(data);
      });
  }

  protected removeResult(postId: string): void {
    this.searchResults.update((posts) =>
      posts.filter((post) => post.id !== postId),
    );
  }

  private findPosts(query: string): Observable<Post[]> {
    return this.semanticSearchService.search(query).pipe(
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
    );
  }
}
