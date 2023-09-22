<script lang="ts" setup>
import { useAuthUserStore } from '@/lib/auth/auth-user.store';
import { type Reply } from '@/lib/models/discussion.model';
import { envs } from '@/lib/utils/envs';
import moment from 'moment';
import { ref } from 'vue';
import LikeButton from './LikeButton.vue';

defineProps<{
  reply: Reply;
}>();

const authUserStore = useAuthUserStore();

const editing = ref(false);

function formatDate(date: string) {
  return moment(date).format('MMM D, YYYY');
}

async function toggleLiked([liked, count]: any) {}
</script>

<template>
  <div class="discussion">
    <img class="userphoto" :src="`${envs.API_BASE_URL}/users/${reply.authorId}/photo`" />
    <div class="flex-vert-sm">
      <div class="header">
        <div>{{ reply.author.name }}</div>
        <div class="posted-at">{{ formatDate(reply.createdAt) }}</div>
      </div>
      <p class="text" @click="editing = authUserStore.user?.id === reply.authorId && !editing">
        {{ reply.text }}
      </p>
      <div class="footer">
        <LikeButton :liked="true" :count="5" @toggled="toggleLiked" />
      </div>
      <!-- <TextareaForm v-if="showCreateDiscussion" placeholder="Give a reply..." @send="addReply" /> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.discussion {
  display: flex;
  gap: 15px;
}

.userphoto {
  height: 40px;
  grid-area: userphoto;
}

.header {
  grid-area: header;
  display: flex;
  gap: 10px;
  align-items: baseline;
}

.posted-at {
  color: #777;
  font-size: 12px;
}

.task {
  color: #777;
  font-size: 12px;
}

.text {
  grid-area: content;
  color: #5b5b5b;
  font-size: 15px;
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}

.footer {
  grid-area: footer;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #aaa;
  font-size: 12px;
}

.replies {
  grid-area: replies;
  display: flex;
  flex-direction: column;
}

.reply:not(:last-of-type) {
  border-bottom: 1px solid #ccc;
}

.textarea-form {
  grid-area: add-reply;
}

button {
  font-size: 12px;
  padding: 2px 7px;
  border-radius: 5px;
}
</style>
