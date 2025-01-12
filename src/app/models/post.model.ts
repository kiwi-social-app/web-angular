import { User } from "./user.model";

export interface Post {
  id: string;
  title: string;
  body: string;
  image?: string | null;
  userID: string;
  createdAt: any;
  updatedAt?: any;
  author?: User | null;
}
