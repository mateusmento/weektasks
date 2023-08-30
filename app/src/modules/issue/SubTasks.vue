<script lang="ts" setup>
import type { Issue } from '@/lib/models/issue.model';
import { createIssuesRepository } from '@/lib/service/issues.service';
import SubTask from './SubTask.vue';
import CreateSubTask from './CreateSubTask.vue';

const props = defineProps<{
  issue: Issue;
}>();

const emit = defineEmits(['update:issue']);

const issueRepo = createIssuesRepository();

async function createSubTask(data: { title: string }) {
  const subtask = await issueRepo.createSubTask(props.issue.id, data);
  emit('update:issue', { ...props.issue, subtasks: [...props.issue.subtasks, subtask] });
}

async function removeSubtask(subtask: any) {
  await issueRepo.removeSubtask(subtask.id);
  const subtasks = props.issue.subtasks.filter((s) => s.id !== subtask.id);
  emit('update:issue', { ...props.issue, subtasks });
}
</script>

<template>
  <div class="flex-vert-md">
    <ul class="flex-vert-md">
      <SubTask
        v-for="subtask of issue.subtasks"
        :key="subtask.id"
        :subtask="subtask"
        @remove="removeSubtask"
      />
    </ul>
    <CreateSubTask @create="createSubTask" />
  </div>
</template>

<style lang="scss" scoped>
.create-subtask {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;

  button {
    background: #8459ff;
    padding: 5px;
  }

  input {
    border: none;
    background: none;
    padding: 5px 10px;
    outline: none;
    border: 2px solid transparent;
    transition: border-color 100ms;
    background-color: #e7e8ff;
    color: #8459ff;
  }

  input::placeholder {
    color: #a888ff;
  }

  input:focus {
    border-color: #8459ff;
  }
}
</style>
