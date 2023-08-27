<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Discussion from './Discussion.vue';
import { DiscussionService } from './discussion.service';

const props = defineProps<{
  id: string,
  discussionId: string,
}>();

const discussion = ref<any>(null);
const replies = ref<any[]>([]);
const discussionService = new DiscussionService();

onMounted(async () => {
  discussion.value = await discussionService.findDiscussion(+props.discussionId);
  replies.value = await discussionService.findReplies(+props.discussionId);
});

async function createReply(reply: any) {
  reply = await discussionService.createReply(+props.discussionId, reply);
  reply.type = 'feedback'
  replies.value.push(reply);
  console.log(replies);
}
</script>

<template>
  <div class="discussion-view container content vertical">
    <div class="card card-lg p-md">
      <Discussion v-if="discussion" v-model:discussion="discussion" />
      <FormKit type="form" @submit="createReply">
        <FormKit type="textarea" name="text" />
      </FormKit>
      <Discussion v-for="(reply, i) in replies" :key="reply.id" v-model:discussion="replies[i]" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
