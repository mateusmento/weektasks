<script lang="ts" setup>
import IconChecked from '@/lib/components/icons/IconChecked.vue';
import { RouterLink, useRoute } from 'vue-router';
import DiscussionType from './DiscussionType.vue';
import LikeButton from './LikeButton.vue';
import { DiscussionService } from './discussion.service';

const route = useRoute();

const discussionService = new DiscussionService();

const props = defineProps<{
  discussion: any;
}>();

const emit = defineEmits(['update:discussion']);

async function toggleLiked([liked, count]: any) {
  discussionService.likeDiscussion(props.discussion.id);
  emit('update:discussion', { ...props.discussion, liked, likes: count });
}
</script>

<template>
  <div class="discussion">
    <img class="userphoto" src="/img/user1.png" />
    <div class="header">
      <div>
        <div class="name">Mateus Sarmento</div>
        <div class="posted-at">Set 12, 2022</div>
      </div>
      <DiscussionType :type="discussion.type" />
      <div v-if="discussion.type === 'progress'" class="task-link flex-horz gap-sm">
        <IconChecked />
        Maintain issues ordering in sprint
      </div>
    </div>
    <p class="text-content"><pre>{{ discussion.text }}</pre></p>
    <div class="footer">
      <LikeButton :liked="discussion.liked" :count="discussion.likes" @toggled="toggleLiked" />
      <div>Reply</div>
      <RouterLink
        :to="{ name: 'discussion', params: { id: route.params.id, discussionId: discussion.id } }"
      >
        <button class="light-purple" hover>See Discussion</button>
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.discussion {
  display: grid;
  grid-template-columns: fit-content(0) 1fr fit-content(0);
  grid-template-rows: fit-content(0) 1fr fit-content(0);
  grid-template-areas: 'userphoto header' 'userphoto content' 'userphoto footer';
  gap: 10px;
}

.userphoto {
  width: 40px;
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
  font-size: 10px;
}

.task-link {
  color: #777;
  font-size: 12px;
}

.text-content {
  grid-area: content;
  color: #5b5b5b;
}

.footer {
  grid-area: footer;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #aaa;
  font-size: 12px;
}

.like {
  display: flex;
  gap: 5px;
}

button {
  font-size: 12px;
  padding: 2px 7px;
  border-radius: 5px;
}
</style>
