import { Post } from '../models/post.model'; // Adjust the import path as needed

export function transformPost(post: any): Post {
  return {
    id: post.id,
    title: post.title,
    body: post.body,
    image: post.image,
    createdAt: post.created_at || post.createdAt,
    updatedAt: post.updated_at || post.updatedAt,
    author: post.author,
  };
}
