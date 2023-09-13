<script lang="ts" setup>
import { ref } from 'vue';
import { Check } from '@element-plus/icons-vue';
import type { Issue } from '@/lib/models/issue.model';
import WkEditable from '@/lib/components/form/WkEditable.vue';
import { useIssueModalStore } from '@/lib/stores/issue-modal.store';
import IconDragHandle from '@/lib/components/icons/IconDragHandle.vue';
import IconEdit from '@/lib/components/icons/IconEdit.vue';
import IconTrash from '@/lib/components/icons/IconTrash.vue';
import Checkbox from '@/lib/components/form/Checkbox.vue';
import IssueTypeSelect from './IssueTypeSelect.vue';
import IssueUserAssignment from '@/lib/components/IssueUserAssignment.vue';
import { envs } from '@/lib/utils/envs';
import type { User } from '@/lib/models/user.model';

const props = defineProps<{
  issue: Issue;
}>();

const emit = defineEmits<{
  (e: 'patch', partial: Partial<Issue>, id: number): void;
  (e: 'remove', id: number): void;
  (e: 'add-assignee', user: User): void;
  (e: 'remove-assignee', user: User): void;
}>();

const issueModalStore = useIssueModalStore();

const editable = ref(false);
const selected = ref(false);

const title = ref(props.issue.title);
const estimation = ref(props.issue.estimation);

function patch(partial: Partial<Issue>) {
  emit('patch', partial, props.issue.id);
}

function remove(id: number) {
  emit('remove', id);
}

function udpateIssueType(type: any) {
  patch({ type });
}

function startEditing() {
  editable.value = true;
}

function confirmEditing() {
  patch({
    title: title.value,
    estimation: estimation.value,
  });
  editable.value = false;
}

function cancelEditing() {
  title.value = props.issue.title;
  estimation.value = props.issue.estimation;
  editable.value = false;
}

function addAssignee(assignee: User) {
  emit('add-assignee', assignee);
}

function removeAssignee(assignee: User) {
  emit('remove-assignee', assignee);
}
</script>

<template>
  <div class="issue backlog-item" :class="{ 'draggable-handle': !editable, selected }">
    <IconDragHandle class="hover-hidden" />
    <Checkbox v-model="selected" radio />
    <IssueTypeSelect :type="issue.type" @update:type="udpateIssueType" />

    <WkEditable class="small" v-model="title" :editable="editable">
      <template #text="{ value, attrs }">
        <div class="issue-title" v-bind="attrs" @click="issueModalStore.open(issue)">
          {{ value }}
        </div>
      </template>
    </WkEditable>

    <IconEdit v-if="!editable" class="hover-hidden" @click="startEditing" />

    <template v-else>
      <span @click="confirmEditing" title="Confirm edit">
        <el-icon>
          <Check />
        </el-icon>
      </span>
      <span @click="cancelEditing" title="Cancel edit">
        <el-icon>
          <Close />
        </el-icon>
      </span>
    </template>

    <div class="spacer"></div>

    <IssueUserAssignment :issue="issue" @assign="addAssignee" @remove="removeAssignee" />

    <span v-if="issue.assignees.length > 0" class="assigned-to">
      <img
        v-for="assignee of issue.assignees"
        :key="assignee.id"
        class="assignee-photo"
        :src="`${envs.API_BASE_URL}/users/${assignee.id}/photo`"
      />
    </span>

    <WkEditable class="small story-points-input" v-model="estimation" :editable="editable">
      <template #text="{ value, attrs }">
        <span v-bind="attrs" class="story-points">{{ value ?? '-' }} pts</span>
      </template>
    </WkEditable>

    <IconTrash class="hover-hidden" @click="remove(issue.id)" />
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
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25);
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
  background-color: #e9e8f0;
}
</style>

<style scoped>
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
