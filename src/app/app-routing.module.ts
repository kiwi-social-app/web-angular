import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewPostComponent } from './new-post/new-post.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/post-list', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'new-post', component: NewPostComponent, canActivate: [AuthGuard] },
  { path: 'post-list', component: PostListComponent, canActivate: [AuthGuard] },
  {
    path: 'posts/:id',
    pathMatch: 'full',
    component: PostDetailComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
