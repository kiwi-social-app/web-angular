import { Post } from './post.model';
import { Chat } from './chat.model';
import firebase from 'firebase/compat/app';
import FireBaseUser = firebase.User;

export interface User extends FireBaseUser {
  id: string;
  username?: string;
  email: string;
  firstname?: string;
  lastname?: string;
  posts: Post[];
  chats: Chat[];
  favorites: string[];
  likedPosts: string[];
  dislikedPosts: string[];
}
