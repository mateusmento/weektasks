<script lang="ts" setup>
import { ref } from 'vue';
import IconPlus from '@/lib/components/icons/IconPlus.vue';
import IssueTypeSelect from './IssueTypeSelect.vue';

const emit = defineEmits(['created']);

const backlogItemTitle = ref('');
const itemType = ref('story');

async function createBacklogItem() {
  let createItemData = { title: backlogItemTitle.value, type: itemType.value };
  backlogItemTitle.value = '';
  emit('created', createItemData);
}
</script>

<template>
  <form class="add-task" @submit.prevent="createBacklogItem">
    <button class="add-button" type="submit" pill data-testid="create-issue-btn">
      <IconPlus />
    </button>

    <IssueTypeSelect v-model:type="itemType" />

    <input
      v-model="backlogItemTitle"
      data-testid="issue-title-input"
      placeholder="Add a new user story..."
    />
  </form>
</template>

<style lang="scss" scoped>
.add-task {
  display: flex;
  gap: 10px;
  /* background-color: #f0f7ff; */
  /* background-color: #E7E8FF; */
  align-items: center;
  border-radius: 10px;
  padding: 0 10px;

  .add-button {
    background: #773bc3;
    padding: 5px;
  }

  input {
    border: none;
    background-color: inherit;
    outline: none;
    /* color: #8459FF; */
    margin: 10px;
    padding: 5px;
    transition: 200ms;
    border-radius: 0px;
  }

  input::placeholder {
    color: #a888ff;
  }
}
</style>
