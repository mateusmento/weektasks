<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Sprint } from '@/lib/models/sprint.model';
import IssueItem from '../components/BacklogItem.vue';
import draggable from 'vuedraggable';
import { createSprintsRepository } from '@/lib/service/sprints.service';
import { AxiosError } from 'axios';
import AddBacklogItem from '../components/AddBacklogItem.vue';

let props = defineProps<{
  sprint: Sprint;
}>();

let emit = defineEmits(['update:sprint']);

let sprintIssues = computed({
  get: () => props.sprint.issues,
  set: (issues) => emit('update:sprint', { ...props.sprint, issues }),
});

let sprintHasNoIssues = computed(() => props.sprint.issues.length === 0);

let hideIssues = ref(false);

const sprintsRepo = createSprintsRepository();

async function createIssue(createIssueData: any) {
  try {
    let issue = await sprintsRepo.createIssue(props.sprint.id, createIssueData);
    sprintIssues.value = [...props.sprint.issues, issue];
  } catch (ex) {
    if (ex instanceof AxiosError) alert(ex.response?.data.message);
  }
}

async function removeIssue(id: number) {
  await sprintsRepo.removeIssue(id);
  sprintIssues.value = props.sprint.issues.filter((i) => i.id !== id);
}

async function moveIssue({ moved, added, removed }: any) {
  if (added) {
    let { id } = added.element;
    sprintsRepo.includeItem(props.sprint.id, { issueId: id, order: added.newIndex });
  }

  if (removed) {
    let { id } = removed.element;
    sprintsRepo.removeItem(props.sprint.id, id);
  }

  if (moved) {
    let { id } = moved.element;
    sprintsRepo.moveItem(props.sprint.id, id, moved.newIndex);
  }
}
</script>

<template>
  <div class="sprint-issues" :class="{ hide: hideIssues }">
    <draggable
      class="sprint-backlog"
      v-model="sprintIssues"
      item-key="id"
      tag="ul"
      data-dropzone="sprint"
      handle=".draggable-handle"
      group="issues"
      @change="moveIssue"
    >
      <template #item="{ element: issue, index: i }">
        <li>
          <IssueItem v-model:issue="sprintIssues[i]" @remove="removeIssue(issue.id)" />
        </li>
      </template>
      <template #footer>
        <li v-if="sprintHasNoIssues" class="issue-placeholder">
          <small>
            <i>Move an issue here</i>
          </small>
        </li>
      </template>
    </draggable>

    <AddBacklogItem @created="createIssue" />
  </div>
</template>

<style scoped lang="scss">
.sprint-issues {
  margin-top: 5px;
  background: #f6faff;
  border-radius: 8px;
  padding: 5px;
}

.sprint-issues.hide {
  display: none;
}

.issue-placeholder {
  color: #777;
  padding: 0 10px;
}

.sprint-backlog {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 5px;
}
</style>
