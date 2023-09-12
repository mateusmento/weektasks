<script lang="ts" setup>
import { ref } from 'vue';
import IconPlus from '@/lib/components/icons/IconPlus.vue';
import IssueTypeSelect from './IssueTypeSelect.vue';

const emit = defineEmits(['created']);

const title = ref('');
const type = ref('story');

async function createBacklogItem() {
  let data = { title: title.value, type: type.value };
  title.value = '';
  emit('created', data);
}
</script>

<template>
  <form class="add-task" @submit.prevent="createBacklogItem">
    <IssueTypeSelect v-model:type="type" />

    <input v-model="title" data-testid="issue-title-input" placeholder="Add a new user story..." />

    <button class="add-button" type="submit" pill data-testid="create-issue-btn">
      <IconPlus />
    </button>
  </form>
</template>

<style lang="scss" scoped>
.add-task {
  display: flex;
  gap: 10px;
  align-items: center;
  border-radius: 10px;
  padding: 0 10px;

  .add-button {
    background: #8459ff;
    background-color: #bbcbdf;
    padding: 5px;
  }

  input {
    border: none;
    background-color: inherit;
    outline: none;
    color: #8459ff;
    margin: 10px;
    padding: 5px;
    transition: 200ms;
    border-radius: 0px;
  }

  input::placeholder {
    color: #4813db;
  }
}
</style>
