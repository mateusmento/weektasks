<script lang="ts" setup>
interface Message {
  text: string;
  date: string;
  author: {
    name: string;
  };
}

defineProps<{
  message: Message;
  mine?: boolean;
  discussion?: boolean;
}>();
</script>

<template>
  <div class="message" :class="{ mine, discussion }">
    <div class="message_author">Mateus Sarmento</div>
    <div class="message_date">1h ago</div>
    <div class="message_text">Hey everyone I think what I'm is trying to say nothing</div>
    <div class="message_footer">
      <div class="start-discussion">Start a discussion</div>
    </div>
  </div>
</template>

<style scoped>
.message {
  display: grid;
  grid-template-columns: 1fr fit-content(0);
  grid-template-rows: fit-content(0) 1fr fit-content(0);
  gap: 10px;
  max-width: 320px;
  width: fit-content;

  padding: 15px;
}

.message.discussion {
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.message.mine {
  border-top-right-radius: 0;
  margin-left: auto;
}

.message:not(.mine) {
  border-top-left-radius: 0;
  margin-right: auto;
}

.message_date {
  white-space: nowrap;
}

.message_text,
.message_footer {
  grid-column: 1 / 3;
}

.message_footer {
  width: 100%;
}

.start-discussion {
  margin-left: auto;
  width: fit-content;
}
</style>
