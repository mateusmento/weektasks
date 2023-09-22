<script lang="ts" setup>
import IconChecked from '@/lib/components/icons/IconChecked.vue';
import DiscussionType from './DiscussionType.vue';
import LikeButton from './LikeButton.vue';
import { DiscussionApi } from './discussion.api';
import { envs } from '@/lib/utils/envs';
import moment from 'moment';
import MiniReply from './MiniReply.vue';
import type { Discussion, Reply as IReply } from '@/lib/models/discussion.model';
import { computed, ref } from 'vue';
import TextareaForm from './TextareaForm.vue';
import { useAuthUserStore } from '@/lib/auth/auth-user.store';
import { requestApi } from '@/lib/utils/api';

const props = withDefaults(
  defineProps<{
    discussion: Discussion;
    replies: IReply[];
    productId: number;
  }>(),
  {
    replies: () => [],
  }
);

const emit = defineEmits(['update:discussion', 'add-reply', 'view']);

const discussionApi = new DiscussionApi();
const authUserStore = useAuthUserStore();

const showCreateDiscussion = ref(false);

const discussion = computed({
  get: () => props.discussion,
  set: (v) => emit('update:discussion', v),
});

async function toggleLiked([liked, count]: any) {
  discussionApi.likeDiscussion(props.discussion.id);
  emit('update:discussion', { ...props.discussion, liked, likes: count });
}

function formatDate(date: string) {
  return moment(date).format('MMM D, YYYY');
}

async function addReply(text: string) {
  const data = {
    text,
    discussionId: props.discussion.id,
    authorId: authUserStore.user?.id,
  };
  const reply = await requestApi(discussionApi.createReply(props.discussion.id, data));
  discussion.value = {
    ...discussion.value,
    replies: [...props.discussion.replies, reply],
  };
  emit('add-reply', reply);
}
</script>

<template>
  <div class="discussion">
    <img class="userphoto" :src="`${envs.API_BASE_URL}/users/${discussion.authorId}/photo`" />
    <div class="flex-vert-md">
      <div class="header">
        <div>
          <div>{{ discussion.author.name }}</div>
          <div class="posted-at">{{ formatDate(discussion.createdAt) }}</div>
        </div>
        <DiscussionType :type="discussion.type" />
        <div v-if="discussion.type === 'progress'" class="task flex-horz gap-sm">
          <IconChecked />
          Maintain issues ordering in sprint
        </div>
      </div>
      <p class="text">{{ discussion.text }}</p>
      <div class="footer">
        <LikeButton :liked="discussion.liked" :count="discussion.likes" @toggled="toggleLiked" />
        <button class="light-purple" hover @click="emit('view', discussion)">See Discussion</button>
      </div>
      <div v-if="replies.length" class="replies">
        <MiniReply v-for="reply of replies" :key="reply.id" :reply="reply" />
        <button class="w-fit" hover @click="showCreateDiscussion = !showCreateDiscussion">
          Add a reply
        </button>
      </div>
      <TextareaForm v-if="showCreateDiscussion" placeholder="Give a reply..." @send="addReply" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.discussion {
  display: flex;
  gap: 10px;
}

.userphoto {
  height: 40px;
  grid-area: userphoto;
}

.header {
  grid-area: header;
  display: flex;
  align-items: flex-start;
  gap: 20px;
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
