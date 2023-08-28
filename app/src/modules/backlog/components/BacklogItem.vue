<script lang="ts" setup>
import { ref, computed } from 'vue';
import { Check } from '@element-plus/icons-vue';
import type { Issue } from '@/lib/models/issue.model';
import WkEditable from '@/lib/components/form/WkEditable.vue';
import { createIssuesRepository } from '@/lib/service/issues.service';
import { useIssueModalStore } from '@/lib/stores/issue-modal.store';
import IconDragHandle from '@/lib/components/icons/IconDragHandle.vue';
import IconEdit from '@/lib/components/icons/IconEdit.vue';
import IconTrash from '@/lib/components/icons/IconTrash.vue';
import Checkbox from '@/lib/components/form/Checkbox.vue';
import IssueTypeSelect from './IssueTypeSelect.vue';
import IssueUserAssignment from '@/lib/components/IssueUserAssignment.vue';
import { envs } from '@/lib/utils/envs';

let props = defineProps<{
  issue: Issue;
}>();

let emit = defineEmits(['remove', 'update:issue']);

let editable = ref(false);

let issueTitle = computed({
  get: () => props.issue.title,
  set: (title) => emit('update:issue', { ...props.issue, title }),
});

const issue = computed({
  get: () => props.issue,
  set: (partial) => emit('update:issue', { ...props.issue, ...partial }),
});

function removeIssue(id: number) {
  emit('remove', id);
}

const issuesRepo = createIssuesRepository();

async function updateIssueTitle() {
  await issuesRepo.patchIssue(props.issue.id, {
    title: issueTitle.value,
    estimation: props.issue.estimation,
  });
  editable.value = false;
}

async function clearIssueEdit() {
  editable.value = false;
}

async function udpateIssueType($event: any) {
  const data = { type: $event } as any;
  await issuesRepo.patchIssue(props.issue.id, data);
  issue.value = data;
}

const issueModalStore = useIssueModalStore();
</script>

<template>
  <div
    class="issue backlog-item"
    :class="{ 'draggable-handle': !editable, selected: issue.selected }"
  >
    <IconDragHandle class="hover-hidden" />
    <Checkbox v-model="issue.selected" radio />
    <IssueTypeSelect :type="issue.type" @update:type="udpateIssueType" />

    <WkEditable class="small" v-model="issueTitle" :editable="editable">
      <template #text="{ value, attrs }">
        <div class="issue-title" v-bind="attrs" @click="issueModalStore.open(issue)">
          {{ value }}
        </div>
      </template>
    </WkEditable>

    <IconEdit v-if="!editable" class="hover-hidden" @click="editable = !editable" />
    <template v-else>
      <span @click="updateIssueTitle" title="Confirm edit">
        <el-icon>
          <Check />
        </el-icon>
      </span>
      <span @click="clearIssueEdit" title="Cancel edit">
        <el-icon>
          <Close />
        </el-icon>
      </span>
    </template>

    <div class="spacer"></div>

    <IssueUserAssignment v-model:issue="issue" />
    <span v-if="issue.assignees.length > 0" class="assigned-to">
      <img
        v-for="assignee of issue.assignees"
        :key="assignee.id"
        class="assignee-photo"
        :src="`${envs.API_BASE_URL}/users/${assignee.id}/photo`"
      />
    </span>

    <WkEditable class="small story-points-input" v-model="issue.estimation" :editable="editable">
      <template #text="{ value, attrs }">
        <span v-bind="attrs" class="story-points">{{ value ?? '-' }} pts</span>
      </template>
    </WkEditable>

    <IconTrash class="hover-hidden" @click="removeIssue(issue.id)" />
  </div>
</template>

<style lang="scss" scoped>
.backlog-item {
  box-sizing: border-box;

  display: flex;
  align-items: center;
  padding: 5px 10px;
  gap: 10px;

  background: #fff;
  border: 0.5px solid #ccc;
  box-shadow: 0px 0.5px 1px rgba(0, 0, 0, 0.25);
  border-radius: 5px;

  font-size: 14px;
  color: #777;
}

.hover-hidden {
  transition: 100ms;
}

.backlog-item:not(:hover) .hover-hidden {
  opacity: 0;
}

.issue-data {
  overflow: hidden;

  input,
  textarea {
    margin-top: 5px;
  }
}

.issue-title {
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.story-points {
  font-size: 12px;
  color: #777;
  background-color: #ccc;
  border-radius: 10px;
  padding: 0 5px;
  white-space: nowrap;
}

input.story-points-input {
  width: 60px;
}

.selected {
  background-color: aliceblue;
}
</style>

<style lang="scss" scoped>
.assigned-to {
  white-space: nowrap;
}

.assigned-to {
  display: flex;
  align-items: center;
  margin-right: 10px;
  font-size: 0.8rem;
}

.assignee-photo {
  width: 17px;
}
</style>
