<script lang="ts" setup>
import type {
  IssueComment as IIssueComment,
  SubTask as ISubTask,
  Issue,
} from '@/lib/models/issue.model';
import { createIssuesRepository } from '@/lib/service/issues.service';
import { computed } from 'vue';
import IssueDescription from './IssueDescription.vue';
import IssueHeader from './IssueHeader.vue';

import CreateSubTask from './CreateSubTask.vue';
import SubTask from './SubTask.vue';

import CreateIssueComment from './CreateIssueComment.vue';
import IssueComment from './IssueComment.vue';

const props = defineProps<{
  issue: Issue;
}>();

const emit = defineEmits(['update:issue']);

const issueRepo = createIssuesRepository();

const issue = computed({
  get: () => props.issue,
  set: (value) => emit('update:issue', value),
});

async function patchIssue(partial: Partial<Issue>, id: number) {
  await issueRepo.patchIssue(id, partial);
  issue.value = { ...issue.value, ...partial };
}

async function createSubTask(data: any) {
  const subtask = await issueRepo.createSubTask(props.issue.id, data);
  issue.value = {
    ...issue.value,
    subtasks: [...issue.value.subtasks, subtask],
  };
}

async function patchSubTask(partial: Partial<ISubTask>, id: number) {
  await issueRepo.patchSubTask(id, partial);
}

async function removeSubtask(subtask: ISubTask) {
  await issueRepo.removeSubtask(subtask.id);
  issue.value = {
    ...issue.value,
    subtasks: props.issue.subtasks.filter((s) => s.id !== subtask.id),
  };
}

async function addComment(data: any) {
  const comment = await issueRepo.addComment(props.issue.id, data);
  issue.value = {
    ...issue.value,
    comments: [comment, ...issue.value.comments],
  };
}

async function removeComment({ id }: IIssueComment) {
  await issueRepo.removeComment(id);
  issue.value = {
    ...issue.value,
    comments: issue.value.comments.filter((c) => c.id !== id),
  };
}

async function patchComment(partial: Partial<IIssueComment>, id: number) {
  await issueRepo.updateComment(id, partial);
}
</script>

<template>
  <div class="issue">
    <IssueHeader :issue="issue" />

    <div class="section">
      <div class="top">
        <div class="title">Description</div>
      </div>
      <IssueDescription :issue="issue" @patch="patchIssue" />
    </div>

    <div class="section">
      <div class="top">
        <div class="title">Subtasks</div>
        <div class="subtitle">{{ issue.subtasks.length }} subtasks</div>
      </div>
      <div class="card card-lg flex-vert-md">
        <SubTask
          v-for="(subtask, i) of issue.subtasks"
          :key="subtask.id"
          v-model:subtask="issue.subtasks[i]"
          @remove="removeSubtask"
          @patch="patchSubTask"
        />
        <CreateSubTask @create="createSubTask" />
      </div>
    </div>

    <div class="section">
      <div class="top">
        <div class="title">Comments</div>
      </div>
      <CreateIssueComment @create="addComment" />
      <IssueComment
        v-for="(comment, i) of issue.comments"
        :key="comment.id"
        v-model:comment="issue.comments[i]"
        @remove="removeComment"
        @patch="patchComment"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.issue {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 30px;
}

.issue-header {
  margin-bottom: 40px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .top {
    margin-left: 20px;
  }

  .title {
    font-size: 18px;
  }

  .subtitle {
    color: #aaa;
  }
}
</style>
