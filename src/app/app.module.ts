import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewPostComponent } from './components/new-post/new-post.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { NewCommentComponent } from './components/new-comment/new-comment.component';
import { UserPostsComponent } from './components/user-posts/user-posts.component';
import { PostEditComponent } from './components/post-edit/post-edit.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { ChatComponent } from './components/chat/chat.component';
import { AngularFireModule } from "@angular/fire/compat";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../environments/environment";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {getStorage, provideStorage} from "@angular/fire/storage";

@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    NavbarComponent,
    DashboardComponent,
    NewPostComponent,
    PostDetailComponent,
    PostCardComponent,
    SignupComponent,
    LoginComponent,
    CommentListComponent,
    NewCommentComponent,
    UserPostsComponent,
    PostEditComponent,
    ImageGalleryComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
