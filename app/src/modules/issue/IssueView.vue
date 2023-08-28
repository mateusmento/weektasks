<script lang="ts" setup>
import ColorfulBar from '@/lib/components/layout/ColorfulBar.vue';
import type { Issue } from '@/lib/models/issue.model';
import { createIssuesRepository } from '@/lib/service/issues.service';
import { vOnClickOutside } from '@vueuse/components';
import { computed, onMounted, reactive, ref } from 'vue';
import IssueComments from './IssueComments.vue';
import SubTasks from './SubTasks.vue';
import { vTextareaAutosize } from '@/lib/directives/textarea-autosize.directive';

const props = defineProps<{
  issueId?: number;
  issue: Issue;
}>();

const emit = defineEmits(['update:issue']);

const state = reactive({ issue: null as Issue | null });

const issue = computed({
  get: () => props.issue ?? state.issue,
  set: (value) => {
    if (props.issue) emit('update:issue', value);
    else state.issue = value;
  },
});

const showStatusOptions = ref(false);

const issueRepo = createIssuesRepository();

onMounted(async () => {
  if (props.issueId) issue.value = await issueRepo.fetchIssue(props.issueId);
});

function updateIssueDescription() {
  issueRepo.patchIssue(issue.value.id, { description: issue.value.description });
}
</script>

<template>
  <div class="issue-view" v-if="issue">
    <ColorfulBar thick />

    <div class="issue-view-content">
      <div class="header">
        <div class="issue-title">{{ issue.title }}</div>
        <div class="row">
          <div class="issue-assigned-to">
            <img
              v-for="assignee of issue.assignees"
              :key="assignee.id"
              class="user-photo"
              :src="`http://localhost:3000/users/${assignee.id}/photo`"
            />
          </div>
          <div
            class="dropdown issue-status-dropdown"
            :class="{ active: showStatusOptions }"
            v-on-click-outside="() => (showStatusOptions = false)"
          >
            <div
              class="issue-status"
              :class="issue.status"
              @click="showStatusOptions = !showStatusOptions"
            >
              {{ issue.status }}
            </div>
            <ul class="dropdown-menu menu list">
              <li class="menu-item" @click="issue && (issue.status = 'todo')">
                <div class="issue-status todo">TODO</div>
              </li>
              <li class="menu-item" @click="issue && (issue.status = 'doing')">
                <div class="issue-status doing">DOING</div>
              </li>
              <li class="menu-item" @click="issue && (issue.status = 'done')">
                <div class="issue-status done">DONE</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="top">
          <div class="title">Description</div>
        </div>
        <div class="card issue-description">
          <textarea
            v-model="issue.description"
            v-textarea-autosize
            placeholder="Give a description..."
          />
          <div class="save">
            <button @click="updateIssueDescription">Save</button>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="top">
          <div class="title">Subtasks</div>
          <div class="subtitle">{{ issue.subtasks.length }} subtasks</div>
        </div>
        <div class="card card-lg">
          <SubTasks v-model:issue="issue" />
        </div>
      </div>

      <IssueComments :issue-id="issue?.id ?? issueId" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.issue-view {
  width: 720px;
  margin: auto;
  background-color: #f6faff;
  height: 100%;
}

.issue-view-content {
  padding: 30px;
  height: 100%;
}

.issue-title {
  font-weight: 400;
  font-size: 20px;
  margin-bottom: 20px;
}

.row {
  display: flex;
  margin-bottom: 40px;
}

.issue-assigned-to {
  flex: 1;
}

.user-photo {
  width: 50px;
  margin-right: -15px;
}

.section {
  margin-bottom: 40px;

  .top {
    margin-left: 20px;
    margin-bottom: 20px;
  }

  .title {
    font-size: 18px;
  }

  .subtitle {
    color: #aaa;
  }
}

.issue-status-dropdown {
  margin-left: auto;

  .menu {
    margin-top: 10px;
    right: 0px;
    width: 120px;
  }
}

.issue-status {
  padding: 5px 15px;
  width: fit-content;
  border-radius: 15px;
  text-transform: uppercase;
  font-weight: 800;
  font-family: 'Nunito', sans-serif;
}

.issue-status.todo {
  background: #c6c6c6;
  color: #6e6e6e;
}

.issue-status.done {
  background: #6cff7d;
  color: #009812;
}

.issue-status.doing {
  background: #98d2ff;
  color: #0e73c1;
}

.issue-description {
  display: flex;
  flex-direction: column;
  gap: 10px;

  textarea {
    border: none;
    resize: none;
    outline: none;
  }

  .save {
    max-height: 0;
    overflow: hidden;
    transition: 500ms;
    margin-left: auto;
  }

  &:focus-within {
    box-shadow: 0 0 0 2px #8459ff;
  }

  &:focus-within .save {
    max-height: 40px;
  }
}
</style>
