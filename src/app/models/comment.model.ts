import { UserBasic } from './userBasic.model';

export interface Comment {
  id: string;
  body: string;
  postID: string;
  created_at: Date;
  author: UserBasic;
  userID: string;
}
