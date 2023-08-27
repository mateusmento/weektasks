import type { User } from '@/lib/models/user.model';

export type IssueType = 'todo' | 'doing' | 'done';

export interface Issue {
  id: number;
  productId: number;
  type: string;
  title: string;
  description: string;
  status: IssueType;
  assignedTo: User;
  assignees: User[];
  subtasks: SubTask[];
  estimation: number;
  selected?: boolean;
}

export interface SubTask {
  id: number;
  title: string;
  completed: boolean;
}

export interface Epic extends Issue {
  issues: Issue[];
}
