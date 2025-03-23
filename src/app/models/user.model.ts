import { Post } from './post.model';
import firebase from 'firebase/compat';
import FireBaseUser = firebase.User;
import { Contact } from './contact.model';

export interface User extends FireBaseUser {
  id: string;
  username?: string;
  email: string;
  firstname?: string;
  lastname?: string;
  posts: Post[];
}
