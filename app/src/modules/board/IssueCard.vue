<script lang="ts" setup>
import Checkbox from '@/lib/components/form/Checkbox.vue';
import IconMore from '@/lib/components/icons/IconMore.vue';
import type { Issue, SubTask } from '@/lib/models/issue.model';
import { IssueApi } from '@/lib/api/issues.api';
import { useIssueModalStore } from '@/lib/stores/issue-modal.store';
import { sortBy } from 'lodash';
import { computed, ref } from 'vue';
import IssueType from './IssueType.vue';
import { envs } from '@/lib/utils/envs';
import IconChat from '@/lib/components/icons/IconChat.vue';

let props = defineProps<{
  issue: Issue;
}>();

const sortedSubtasks = computed(() => sortBy(props.issue.subtasks, (s) => s.id));

const seeCompletedSubtasks = ref(false);

const issueApi = new IssueApi();

function toggleSubtaskCompletion(subtask: SubTask) {
  issueApi.toggleSubtaskCompletion(subtask.id);
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
    <section class="card__main">
      <div class="top-area">
        <div class="issue-title" @click="issueModalStore.open(issue)">{{ issue.title }}</div>
        <div class="actions">
          <IconMore />
        </div>
        <div v-if="issue.subtasks.length === 0" class="issue-description">
          {{ issue.description }}
        </div>
      </div>

      <div v-if="issue.subtasks.length > 0" class="subtasks">
        <div class="flex-vert-sm">
          <div class="flex-horz space-between">
            <span>Progress</span>
            <span>2/3</span>
          </div>
          <div class="subtasks__progressbar">
            <div
              class="progressbar__progress"
              :style="{ 'background-color': `var(--light-${issueColor}-bg)` }"
            ></div>
            <div class="progressbar__remain"></div>
          </div>
        </div>

        <div class="flex-vert-sm">
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
        </div>

        <small
          v-if="issue.subtasks.length > 0"
          class="toggle-completed-subtasks"
          @click="seeCompletedSubtasks = !seeCompletedSubtasks"
        >
          {{ seeCompletedSubtasks ? 'Hide' : 'See' }} done subtasks
        </small>
      </div>

      <div class="flex-horz-md y-center space-between">
        <IssueType class="issue-type" :type="issue.type" />
        <span class="story-points badge">2 pts</span>
      </div>
    </section>

    <footer class="card__footer">
      <div class="comments flex-horz-sm y-center mr-auto">
        <IconChat />
        <span>{{ issue.comments?.length ?? 0 }}</span>
      </div>
      <span v-if="issue.assignees.length > 0" class="assigned-to">
        <img
          v-for="assignee of issue.assignees"
          :key="assignee.id"
          class="assignee-photo"
          :src="`${envs.API_BASE_URL}/users/${assignee.id}/photo`"
        />
      </span>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.issue-card {
  background: #fff;
  border-radius: 10px;
  border-left: 11px solid;
  outline: 1px solid #e2e8f0;
  margin-bottom: 10px;
}

.card__main {
  display: grid;
  gap: 15px;
  padding: 15px;
}

.card__footer {
  border-top: 1px solid #e2e8f0;
  padding: 10px;
}

.top-area {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-auto-rows: auto;
  gap: 10px;
  align-items: center;

  .issue-title {
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    line-height: 100%;
    color: #606066;
  }

  .issue-description {
    white-space: break-spaces;
    color: #a1a1ac;
    font-size: 12px;
    grid-column: span 2;
  }

  .actions {
    justify-self: center;

    opacity: 0;
    transition: opacity 300ms;

    cursor: pointer;
  }

  .issue-type {
    font-weight: 600;
  }

  .story-points {
    padding: 0 5px;
  }
}

.issue-card:hover .actions {
  opacity: 1;
}

.subtasks {
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #585861;

  .subtask {
    transition:
      opacity 1s,
      visibility 1s;

    &.completed {
      opacity: 0;
      visibility: collapse;
    }

    &.seeCompletedSubtasks {
      opacity: 1;
      visibility: visible;
    }
  }

  .subtasks__progressbar {
    display: flex;
    height: 5px;
    width: 100%;
  }

  .subtasks__progressbar :last-child {
    border-radius: 0 50px 50px 0;
  }

  .subtasks__progressbar :first-child {
    border-radius: 50px 0 0 50px;
  }

  .progressbar__progress {
    flex: 2;
  }

  .progressbar__remain {
    flex: 1;
    background-color: #ccc;
  }

  .toggle-completed-subtasks {
    cursor: pointer;
    margin-left: 5px;
  }
}

.card__footer {
  display: flex;
  align-items: center;
  gap: 15px;

  .comments {
    color: #898e92;
  }

  .assigned-to {
    display: flex;
    align-items: center;
    white-space: nowrap;
    font-size: 0.8rem;
  }

  .assignee-photo {
    width: 24px;
  }
}
</style>
