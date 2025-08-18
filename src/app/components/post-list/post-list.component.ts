import {
  Component,
  computed,
  inject,
  OnInit,
  resource,
  ResourceRef,
  Signal,
} from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';
import { PostCardComponent } from '../post-card/post-card.component';
import { RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewPostModalComponent } from '../modals/new-post-modal/new-post-modal.component';
import {
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  switchMap,
  take,
} from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { SemanticSearchService } from '../../services/semantic-search.service';
import { SearchResult } from '../../models/search-result.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  standalone: true,
  imports: [
    PostCardComponent,
    RouterLink,
    FormsModule,
    MatButton,
    MatIcon,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
  ],
})
export class PostListComponent implements OnInit {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly postService: PostService = inject(PostService);
  private readonly userService: UserService = inject(UserService);
  private readonly semanticSearchService: SemanticSearchService = inject(
    SemanticSearchService,
  );

  searchControl = new FormControl('');
  results: SearchResult[] = [];

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

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.semanticSearchService.search(query || '')),
      )
      .subscribe((data) => {
        this.results = data;
        console.log(this.results);
      });
  }

  protected addDoc() {
    this.semanticSearchService.addDocument('Hello world').subscribe({
      next: () => console.log('Document added'),
      error: (err) => console.error(err),
    });
  }

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

  protected filterSelect() {}

  triggerSearch() {
    const query = this.searchControl.value || '';
    this.semanticSearchService.search(query).subscribe((data) => {
      this.results = data;
    });
  }
}
