import {Post} from "./post.model";

export interface User {
  id: string;
  username?: string;
  email: string;
  firstname?: string;
  lastname?: string;
  posts: Post[];
}
