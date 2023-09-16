import type { User } from './user.model';

export interface Discussion {
  id: number;
  type: string;
  text: string;
  liked: boolean;
  likes: number;
  productId: number;
  authorId: number;
  author: User;
  createdAt: string;
  replies: Reply[];
}

export interface Reply {
  id: number;
  text: string;
  discussionId: number;
  authorId: number;
  author: User;
  createdAt: string;
}
