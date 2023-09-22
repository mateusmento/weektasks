<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { DiscussionApi } from './discussion.api';
import moment from 'moment';
import LikeButton from './LikeButton.vue';
import Reply from './Reply.vue';
import TextareaForm from './TextareaForm.vue';
import DiscussionType from './DiscussionType.vue';
import IconChecked from '@/lib/components/icons/IconChecked.vue';
import { envs } from '@/lib/utils/envs';
import { emojify } from 'node-emoji';
import { useAuthUserStore } from '@/lib/auth/auth-user.store';

const props = defineProps<{
  productId: number;
  discussion: any;
}>();

const emit = defineEmits(['update:discussion']);

const authUserStore = useAuthUserStore();

const discussion = computed({
  get: () => props.discussion,
  set: (value) => emit('update:discussion', value),
});

const replies = ref<any[]>([]);
const discussionApi = new DiscussionApi();

onMounted(async () => {
  replies.value = await discussionApi.findReplies(+props.discussion.id);
});

watch(
  () => props.discussion,
  async () => {
    replies.value = await discussionApi.findReplies(+props.discussion.id);
  }
);

function formatDate(date: string) {
  return moment(date).format('MMM D, YYYY');
}

async function toggleLiked([liked, count]: any) {
  discussionApi.likeDiscussion(props.discussion.id);
  emit('update:discussion', { ...props.discussion, liked, likes: count });
}

async function createReply(text: string) {
  const data = {
    text,
    discussionId: props.discussion.id,
    authorId: authUserStore.user?.id,
  };
  const reply = await discussionApi.createReply(+props.discussion.id, data);
  reply.type = 'feedback';
  replies.value.push(reply);
  discussion.value = {
    ...discussion.value,
    replies: [...props.discussion.replies, reply],
  };
}
</script>

<template>
  <div class="discussion h-100">
    <img class="userphoto" :src="`${envs.API_BASE_URL}/users/${discussion.authorId}/photo`" />
    <div class="flex-vert-lg w-100">
      <div class="flex-vert-md w-100">
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
          <div style="font-size: 16px">{{ emojify(':smile:') }}</div>
        </div>
      </div>
      <div v-if="replies.length" class="replies">
        <Reply v-for="reply of replies" :key="reply.id" :reply="reply" />
      </div>
      <TextareaForm placeholder="Give a reply..." @send="createReply" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.replies {
  flex: 1;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reply:not(:last-of-type) {
  border-bottom: 1px solid #ccc;
}

.discussion {
  display: flex;
  gap: 10px;
}

.userphoto {
  height: 40px;
}

.header {
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
  color: #5b5b5b;
  font-size: 15px;
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}

.footer {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #aaa;
  font-size: 12px;
}

button {
  font-size: 12px;
  padding: 2px 7px;
  border-radius: 5px;
}
</style>
