import { UserBasic } from './userBasic.model';

export interface Post {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt?: any;
  author: UserBasic;
  published: boolean;
  favoritedBy: string[];
}
