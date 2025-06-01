import { UserBasic } from './userBasic.model';

export interface Comment {
  id: string;
  body: string;
  postID: string;
  createdAt: Date;
  author: UserBasic;
  userID: string;
}
