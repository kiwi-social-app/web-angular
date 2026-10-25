import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostEditComponent } from './components/post-edit/post-edit.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { authGuard, guestGuard } from './services/auth.guard';
import { ChatComponent } from './components/chat/chat.component';
import { SavedPostsComponent } from './components/saved-posts/saved-posts.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SearchComponent } from './components/search/search.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ShellLayoutComponent } from './layouts/shell-layout/shell-layout.component';
import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
    component: ShellLayoutComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Home',
        component: PostListComponent,
      },
      {
        path: 'dashboard',
        title: 'Your profile',
        component: DashboardComponent,
      },
      {
        path: 'post-edit/:id',
        title: 'Edit post',
        component: PostEditComponent,
      },
      {
        path: 'posts/:id',
        title: 'Post',
        pathMatch: 'full',
        component: PostDetailComponent,
      },
      {
        path: 'search',
        title: 'Search',
        pathMatch: 'full',
        component: SearchComponent,
        canMatch: [() => environment.searchEnabled],
      },
      { path: 'chat', title: 'Chat', component: ChatComponent },
      {
        path: 'saved-posts',
        title: 'Saved posts',
        component: SavedPostsComponent,
      },
      {
        path: 'profile/:id',
        title: 'Profile',
        component: UserProfileComponent,
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        title: 'Log in',
        component: LoginComponent,
        canActivate: [guestGuard],
      },
    ],
  },
];
