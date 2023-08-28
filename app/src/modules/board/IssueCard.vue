<script lang="ts" setup>
import Checkbox from '@/lib/components/form/Checkbox.vue';
import IconMore from '@/lib/components/icons/IconMore.vue';
import type { Issue, SubTask } from '@/lib/models/issue.model';
import { createIssuesRepository } from '@/lib/service/issues.service';
import { useIssueModalStore } from '@/lib/stores/issue-modal.store';
import { sortBy } from 'lodash';
import { computed, ref } from 'vue';
import IssueType from './IssueType.vue';
import { envs } from '@/lib/utils/envs';

let props = defineProps<{
  issue: Issue;
}>();

const sortedSubtasks = computed(() => sortBy(props.issue.subtasks, (s) => s.id));

const seeCompletedSubtasks = ref(false);

const issueRepo = createIssuesRepository();

function toggleSubtaskCompletion(subtask: SubTask) {
  issueRepo.toggleSubtaskCompletion(subtask.id);
}

const issueModalStore = useIssueModalStore();

const issueColor = computed(
  () =>
    ({
      story: 'green',
      task: 'blue',
      bug: 'red',
      quickfix: 'orange',
      component: 'purple',
      refactor: 'green',
      refinement: 'blue',
    })[props.issue.type]
);
</script>

<template>
  <div
    class="issue-card draggable-handle"
    :style="{ 'border-color': `var(--light-${issueColor}-bg)` }"
  >
    <div class="top-section">
      <div class="issue-title" @click="issueModalStore.open(issue)">{{ issue.title }}</div>

      <div class="actions">
        <IconMore />
      </div>
    </div>

    <div class="middle-section">
      <div class="flex-vert gap-sm">
        <div
          v-for="subtask in sortedSubtasks"
          :key="subtask.id"
          class="subtask flex-horz gap-sm"
          :class="{ completed: subtask.completed, seeCompletedSubtasks }"
        >
          <Checkbox
            v-model="subtask.completed"
            @update:modelValue="toggleSubtaskCompletion(subtask)"
          />
          {{ subtask.title }}
        </div>
        <small
          v-if="issue.subtasks.length > 0"
          class="toggle-completed-subtasks"
          @click="seeCompletedSubtasks = !seeCompletedSubtasks"
        >
          {{ seeCompletedSubtasks ? 'Hide' : 'See' }} done subtasks
        </small>
      </div>
    </div>

    <div class="bottom-section">
      <IssueType :type="issue.type" />
      <span v-if="issue.assignees.length > 0" class="assigned-to">
        <img
          v-for="assignee of issue.assignees"
          :key="assignee.id"
          class="assignee-photo"
          :src="`${envs.API_BASE_URL}/users/${assignee.id}/photo`"
        />
      </span>
      <span class="story-points">2 pts</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.issue-card {
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  border-left: 11px solid;
}

.issue-title {
  cursor: pointer;
}

.top-section {
  display: flex;
  margin-bottom: 10px;
  gap: 20px;
}

.middle-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.bottom-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-left: auto;

  .el-icon {
    cursor: pointer;
  }
}

.story-points {
  font-size: 12px;
  color: #777;
  background-color: #ccc;
  border-radius: 10px;
  padding: 0 5px;
  white-space: nowrap;
}

.subtask {
  &.completed {
    opacity: 0;
    visibility: collapse;
    transition: 1s;
  }

  &.seeCompletedSubtasks {
    opacity: 1;
    visibility: visible;
  }
}

.toggle-completed-subtasks {
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
.assigned-to {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 0.8rem;
}

.assignee-photo {
  width: 17px;
}
</style>
