export interface Post {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt?: any;
  authorId: string;
  published: boolean;
}
