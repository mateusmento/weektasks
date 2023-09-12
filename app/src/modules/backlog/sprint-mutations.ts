import type { Issue } from '@/lib/models/issue.model';
import type { Sprint } from '@/lib/models/sprint.model';
import { SprintApi } from '@/lib/api/sprints.api';

const sprintApi = new SprintApi();

export async function patchSprint(sprint: Sprint, partial: Partial<Sprint>) {
  await sprintApi.patchSprint(sprint.id, partial);
  return { ...sprint, ...partial };
}

export async function startSprint(sprintId: number) {
  return await sprintApi.startSprint(sprintId);
}

export async function endSprint(sprintId: number) {
  return await sprintApi.endSprint(sprintId);
}

export async function addIssue(sprint: Sprint, createIssueData: any) {
  const issue = await sprintApi.createIssue(sprint.id, createIssueData);
  return [...sprint.issues, issue];
}

export async function removeIssue(sprint: Sprint, issue: Issue) {
  await sprintApi.removeIssue(issue.id);
  return sprint.issues.filter((i) => i.id !== issue.id);
}
