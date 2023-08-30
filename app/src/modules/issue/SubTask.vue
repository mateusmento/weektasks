<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { SubTask } from '@/lib/models/issue.model';
import IconEdit from '@/lib/components/icons/IconEdit.vue';
import IconTrash from '@/lib/components/icons/IconTrash.vue';
import Checkbox from '@/lib/components/form/Checkbox.vue';
import WkEditable from '@/lib/components/form/WkEditable.vue';

const props = defineProps<{
  subtask: SubTask;
}>();

const emit = defineEmits(['update:subtask', 'patch', 'remove']);

const editable = ref(false);
const title = ref(props.subtask.title);

const completed = computed({
  get: () => props.subtask.completed,
  set: (completed) => patch({ completed }),
});

function patch(partial: Partial<SubTask>) {
  emit('update:subtask', { ...props.subtask, ...partial });
  emit('patch', partial, props.subtask.id);
}

function remove() {
  emit('remove', props.subtask);
}

function startEditing() {
  editable.value = true;
  title.value = props.subtask.title;
}

function confirmEditing() {
  patch({ title: title.value });
  editable.value = false;
}

function cancelEditing() {
  title.value = props.subtask.title;
  editable.value = false;
}
</script>

<template>
  <div class="subtask">
    <Checkbox v-model="completed" />
    <WkEditable class="small" v-model="title" :editable="editable">
      <template #text="{ value, attrs }">
        <div class="title" v-bind="attrs">{{ value }}</div>
      </template>
    </WkEditable>
    <span v-if="editable" @click="confirmEditing" title="Confirm edit">
      <el-icon><Check /></el-icon>
    </span>
    <span v-if="editable" @click="cancelEditing" title="Confirm edit">
      <el-icon><Close /></el-icon>
    </span>
    <IconEdit v-if="!editable" class="hover-hidden" @click="startEditing" />
    <IconTrash class="hover-hidden" @click="remove" />
  </div>
</template>

<style lang="scss" scoped>
.subtask {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hover-hidden {
  transition: opacity 100ms;
}
.subtask:not(:hover) .hover-hidden {
  opacity: 0;
}

.title {
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
