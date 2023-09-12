import type { Issue } from '@/lib/models/issue.model';
import type { User } from '@/lib/models/user.model';
import { IssueApi } from '@/lib/api/issues.api';

const issueApi = new IssueApi();

export async function patchIssue(backlogItem: Issue, partial: Partial<Issue>) {
  await issueApi.patchIssue(backlogItem.id, partial);
  return { ...backlogItem, ...partial };
}

export async function addAssignee(backlogItem: Issue, assignee: User) {
  await issueApi.assignUser(backlogItem.id, assignee.id);
  const assignees = [...backlogItem.assignees, assignee];
  return { ...backlogItem, assignees };
}

export async function removeAssignee(backlogItem: Issue, assignee: User) {
  await issueApi.removeAssignee(backlogItem.id, assignee.id);
  const assignees = backlogItem.assignees.filter((a) => a.id !== assignee.id);
  return { ...backlogItem, assignees };
}
