import { User } from "./user.model";

export interface Comment {
  id: string;
  body: string;
  userID: string;
  postID: string;
  createdAt: Date;
  author: User | null;
}
