<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits(['send']);

const text = ref('');
</script>

<template>
  <form class="textarea-form" @submit.prevent="emit('send', text)">
    <textarea v-model="text" rows="3" v-bind="$attrs"></textarea>
    <button>Send</button>
  </form>
</template>

<style scoped>
.textarea-form {
  display: flex;
  align-items: flex-start;
  background: #e7e8ff;
  border-radius: 10px;
  padding: 15px;
  gap: 10px;
  border: 2px solid transparent;
  width: 100%;
}

.textarea-form:focus-within {
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
  width: 100%;
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
