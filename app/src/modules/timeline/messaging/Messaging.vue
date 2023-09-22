<script lang="ts" setup>
import TextareaForm from '../TextareaForm.vue';
import Message from './Message.vue';
</script>

<template>
  <div class="chat">
    <div class="messages">
      <Message
        mine
        :message="{
          author: { name: 'Mateus Sarmento' },
          date: '1h ago',
          text: 'Hey everyone I think what I\'m is trying to say nothing',
        }"
      />

      <Message
        discussion
        :message="{
          author: { name: 'Marina Lima' },
          date: '1h ago',
          text: 'Hey Mateus, I think that too',
        }"
      />
    </div>
    <TextareaForm placeholder="Send a message..." />
  </div>
</template>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.messages {
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>
