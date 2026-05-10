import { Post } from './post.model';
import { Chat } from './chat.model';
import { User as FirebaseUser } from 'firebase/auth';

export interface User extends FirebaseUser {
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
