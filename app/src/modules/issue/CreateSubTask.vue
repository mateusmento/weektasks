<script lang="ts" setup>
import { ref } from 'vue';
import IconPlus from '@/lib/components/icons/IconPlus.vue';

const emit = defineEmits(['create']);

const title = ref('');

function create() {
  emit('create', { title: title.value });
  title.value = '';
}
</script>

<template>
  <form class="create-subtask" @submit.prevent="create">
    <button pill>
      <IconPlus />
    </button>
    <input v-model="title" placeholder="Add a new subtask..." />
  </form>
</template>

<style lang="scss" scoped>
.create-subtask {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;

  button {
    background: #8459ff;
    padding: 5px;
  }

  input {
    border: none;
    background: none;
    padding: 5px 10px;
    outline: none;
    border: 2px solid transparent;
    transition: border-color 100ms;
    background-color: #e7e8ff;
    color: #8459ff;
  }

  input::placeholder {
    color: #a888ff;
  }

  input:focus {
    border-color: #8459ff;
  }
}
</style>
