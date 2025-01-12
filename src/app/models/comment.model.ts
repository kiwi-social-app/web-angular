import { User } from "./user.model";

export interface Comment {
  id: string;
  body: string;
  postID: string;
  created_at: Date;
  author: User;
  userID: string;
}
