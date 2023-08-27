<script lang="ts" setup>
import { ref } from 'vue';
import type { SubTask } from '@/lib/models/issue.model';
import { createIssuesRepository } from "@/lib/service/issues.service";
import IconEdit from '@/lib/components/icons/IconEdit.vue';
import IconTrash from '@/lib/components/icons/IconTrash.vue';
import Checkbox from '@/lib/components/form/Checkbox.vue';
import WkEditable from '@/lib/components/form/WkEditable.vue';

const props = defineProps<{
  subtask: SubTask,
}>();

const emit = defineEmits(['update:issue', "remove"]);

const issueRepo = createIssuesRepository();

const editable = ref(false);

async function removeSubtask(subtask: any) {
  emit("remove", subtask);
}

async function updateIssueTitle() {
  await issueRepo.patchSubTask(props.subtask.id, { title: props.subtask.title });
  editable.value = false;
}

async function clearIssueEdit() {
  editable.value = false;
}
</script>

<template>
  <li class="subtask flex-horz-md">
    <Checkbox v-model="subtask.completed"/>
    <WkEditable class="small" v-model="subtask.title" :editable="editable">
      <template #text="{value, attrs}">
        <div class="issue-title" v-bind="attrs">{{ value }}</div>
      </template>
    </WkEditable>
    <span v-if="editable" @click="updateIssueTitle" title="Confirm edit">
      <el-icon><Check /></el-icon>
    </span>
    <span v-if="editable" @click="clearIssueEdit" title="Confirm edit">
      <el-icon><Close /></el-icon>
    </span>
    <IconEdit class="hover-hidden" @click="(editable = !editable)"/>
    <IconTrash class="hover-hidden" @click="removeSubtask(subtask)"/>
  </li>
</template>

<style lang="scss" scoped>
.hover-hidden {
  transition: opacity 100ms;
}
.subtask:not(:hover) .hover-hidden {
  opacity: 0;
}

.issue-title {
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
