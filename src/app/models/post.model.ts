import { Timestamp } from "rxjs";

export interface Post {
  id: string;
  title: string;
  body: string;
  image?: string | null;
  userID: string;
  createdAt: any;
  updatedAt?: any;
}
