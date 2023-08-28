<script lang="ts" setup>
import { ref } from 'vue';
import { vTextareaAutosize } from '@/lib/directives/textarea-autosize.directive';

const emit = defineEmits(['created']);

const text = ref('');

async function create() {
  emit('created', { text: text.value });
  text.value = '';
}
</script>

<template>
  <div class="create-post flex-vert gap-md">
    <form class="create-discussion" @submit.prevent="create">
      <textarea v-model="text" v-textarea-autosize placeholder="Give a feedback..."></textarea>
      <button>Send</button>
    </form>
  </div>
</template>

<style scoped>
.create-discussion {
  display: flex;
  align-items: flex-start;
  background: #e7e8ff;
  border-radius: 10px;
  padding: 15px;
  gap: 10px;
  border: 2px solid transparent;
}

.create-discussion:focus-within {
  border-color: #8459ff;
}

textarea {
  padding: 0;
  border: none;
  color: #8459ff;
  background-color: unset;
  flex: 1;
  font-size: 14px;
  outline: none;
  resize: none;
}

textarea::placeholder {
  color: #8459ff;
}

button {
  background: #8459ff;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px;
}
</style>
