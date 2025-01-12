import { User } from "./user.model";

export interface Post {
  id: string;
  title: string;
  body: string;
  image?: string | null;
  created_at: any;
  updated_at?: any;
  author: User;
}
