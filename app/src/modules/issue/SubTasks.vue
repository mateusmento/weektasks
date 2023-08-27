<script lang="ts" setup>
import { ref } from 'vue';
import type { Issue } from '@/lib/models/issue.model';
import { createIssuesRepository } from "@/lib/service/issues.service";
import IconPlus from '@/lib/components/icons/IconPlus.vue';
import SubTask from './SubTask.vue';

const props = defineProps<{
  issue: Issue,
}>();

const emit = defineEmits(['update:issue']);

const issueRepo = createIssuesRepository();

const subtaskTitle = ref('');

async function createSubTask() {
  const data = { title: subtaskTitle.value };
  const subtask = await issueRepo.createSubTask(props.issue.id, data);
  const subtasks = [...props.issue.subtasks, subtask];
  emit("update:issue", { ...props.issue, subtasks });
  subtaskTitle.value = '';
}

async function removeSubtask(subtask: any) {
  await issueRepo.removeSubtask(subtask.id);
  const subtasks = props.issue.subtasks.filter(s => s.id !== subtask.id);
  emit("update:issue", { ...props.issue, subtasks });
}
</script>

<template>
  <div class="flex-vert-md">
    <ul class="flex-vert-md">
      <SubTask v-for="subtask of issue.subtasks" :key="subtask.id" :subtask="subtask" @remove="removeSubtask"/>
    </ul>
    <form class="create-subtask" @submit.prevent="createSubTask">
      <button pill>
        <IconPlus/>
      </button>
      <input v-model="subtaskTitle" placeholder="Add a new subtask..."/>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.create-subtask {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;

  button {
    background: #773BC3;
    padding: 5px;
  }

  input {
    border: none;
    background: none;
    padding: 5px 10px;
    outline: none;
    border: 2px solid transparent;
    transition: border-color 100ms;
    background-color: #E7E8FF;
    color: #8459FF;
  }

  input::placeholder {
    color: #a888ff;
  }

  input:focus {
    border-color: #8459FF;
  }
}
</style>
