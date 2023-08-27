import type { Issue } from './issue.model';

export interface Sprint {
  id: number;
  title: string;
  issues: Issue[];
  startedAt: string;
  endedAt: string;
  hasntStarted: boolean;
  isOnGoing: boolean;
  hasEnded: boolean;
}
