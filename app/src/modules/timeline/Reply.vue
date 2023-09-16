<script lang="ts" setup>
import { type Reply } from '@/lib/models/discussion.model';
import moment from 'moment';

defineProps<{
  reply: Reply;
}>();

function formatDate(date: string) {
  return moment(date).format('MMM D, YYYY');
}
</script>

<template>
  <div class="reply">
    <div class="reply__text">{{ reply.text }}</div>
    <div class="reply__author">{{ reply.author.name }}</div>
    <div class="reply__createdAt">{{ formatDate(reply.createdAt) }}</div>
  </div>
</template>

<style scoped>
.reply {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 5px 10px;
}

.reply__text {
  color: #777;
  font-size: 13px;
}

.reply__author {
  color: #ae5dff;
  font-size: 13px;
}

.reply__createdAt {
  color: #777;
  font-size: 13px;
}
</style>
