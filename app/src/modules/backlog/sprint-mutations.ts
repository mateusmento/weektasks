import type { Issue } from '@/lib/models/issue.model';
import type { Sprint } from '@/lib/models/sprint.model';
import { createSprintsRepository } from '@/lib/service/sprints.service';

const sprintsRepo = createSprintsRepository();

export async function patchSprint(sprint: Sprint, partial: Partial<Sprint>) {
  await sprintsRepo.patchSprint(sprint.id, partial);
  return { ...sprint, ...partial };
}

export async function startSprint(sprintId: number) {
  return await sprintsRepo.startSprint(sprintId);
}

export async function endSprint(sprintId: number) {
  return await sprintsRepo.endSprint(sprintId);
}

export async function addIssue(sprint: Sprint, createIssueData: any) {
  const issue = await sprintsRepo.createIssue(sprint.id, createIssueData);
  return [...sprint.issues, issue];
}

export async function removeIssue(sprint: Sprint, issue: Issue) {
  await sprintsRepo.removeIssue(issue.id);
  return sprint.issues.filter((i) => i.id !== issue.id);
}
