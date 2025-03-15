import { User } from './user.model';

export interface Post {
  id: string;
  body: string;
  image?: string | null;
  createdAt: Date;
  updatedAt?: any;
  author: User;
}
