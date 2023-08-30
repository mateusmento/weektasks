<script lang="ts" setup>
import type { Issue } from '@/lib/models/issue.model';
import { reactive, watch } from 'vue';
import { vTextareaAutosize } from '@/lib/directives/textarea-autosize.directive';

const props = defineProps<{
  issue: Issue;
}>();

const state = reactive({
  description: props.issue.description,
});

watch(
  () => props.issue?.description,
  (v) => (state.description = v)
);

const emit = defineEmits(['patch']);

const patch = (partial: Partial<Issue>) => emit('patch', partial, props.issue.id);
</script>

<template>
  <div class="card issue-description">
    <textarea v-model="state.description" v-textarea-autosize placeholder="Give a description..." />
    <div class="save">
      <button class="save-button" @click="patch({ description: state.description })">Save</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

  .save-button {
    background: #8459ff;
    color: white;
  }

  &:focus-within {
    box-shadow: 0 0 0 2px #8459ff;
  }

  &:focus-within .save {
    max-height: 40px;
  }
}
</style>
