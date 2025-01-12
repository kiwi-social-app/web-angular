import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { NewPostComponent } from './components/new-post/new-post.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostEditComponent } from './components/post-edit/post-edit.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { AuthGuard } from './services/auth.guard';
import { SignupComponent } from './components/signup/signup.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';

const routes: Routes = [
  { path: '', redirectTo: '/post-list', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'new-post', component: NewPostComponent, canActivate: [AuthGuard] },
  { path: 'post-list', component: PostListComponent, canActivate: [AuthGuard] },
  {
    path: 'post-edit/:id',
    component: PostEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'posts/:id',
    pathMatch: 'full',
    component: PostDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'images',
    component: ImageGalleryComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
