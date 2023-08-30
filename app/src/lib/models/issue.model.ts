import type { User } from '@/lib/models/user.model';

export type IssueType = 'todo' | 'doing' | 'done';

export interface Issue {
  id: number;
  productId: number;
  type: string;
  title: string;
  description: string;
  status: IssueType;
  assignees: User[];
  subtasks: SubTask[];
  estimation: number;
  selected?: boolean;
  comments: IssueComment[];
}

export interface SubTask {
  id: number;
  title: string;
  completed: boolean;
}

export interface Epic extends Issue {
  issues: Issue[];
}

export interface IssueComment {
  id: number;
  text: string;
  author: User;
}
