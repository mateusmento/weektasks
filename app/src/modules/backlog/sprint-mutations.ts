import type { Issue } from '@/lib/models/issue.model';
import type { Sprint } from '@/lib/models/sprint.model';
import { createSprintsRepository } from '@/lib/service/sprints.service';
import { Alert } from '@/lib/utils/alert';
import { AxiosError } from 'axios';

const sprintsRepo = createSprintsRepository();

export async function patchSprint(sprint: Sprint, partial: Partial<Sprint>) {
  await sprintsRepo.patchSprint(sprint.id, partial);
  return { ...sprint, ...partial };
}

export async function startSprint(sprintId: number) {
  try {
    return await sprintsRepo.startSprint(sprintId);
  } catch (ex) {
    if (ex instanceof AxiosError) Alert.error(ex.response?.data.message);
    throw ex;
  }
}

export async function endSprint(sprintId: number) {
  try {
    return await sprintsRepo.endSprint(sprintId);
  } catch (ex) {
    if (ex instanceof AxiosError) Alert.error(ex.response?.data.message);
    throw ex;
  }
}

export async function addIssue(sprint: Sprint, createIssueData: any) {
  try {
    const issue = await sprintsRepo.createIssue(sprint.id, createIssueData);
    return [...sprint.issues, issue];
  } catch (ex) {
    if (ex instanceof AxiosError) Alert.error(ex.response?.data.message);
    throw ex;
  }
}

export async function removeIssue(sprint: Sprint, issue: Issue) {
  await sprintsRepo.removeIssue(issue.id);
  return sprint.issues.filter((i) => i.id !== issue.id);
}
