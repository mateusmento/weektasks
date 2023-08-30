<script lang="ts" setup>
import { DiscussionService } from '@/modules/timeline/discussion.service';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import CreateDiscussion from './CreateDiscussion.vue';
import Discussion from './Discussion.vue';

const route = useRoute();

const discussionService = new DiscussionService();
const discussions = ref<any[]>([]);

onMounted(async () => {
  discussions.value = await discussionService.findDiscussions(+route.params.id, 1, 10);
});

function addDiscussion($event: any) {
  discussions.value.unshift($event);
}
</script>

<template>
  <main class="timeline-view">
    <CreateDiscussion @created="addDiscussion" />
    <div v-for="(discussion, i) in discussions" :key="discussion.id" class="card card-lg p-md">
      <Discussion v-model:discussion="discussions[i]" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.timeline-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 830px;
  margin: 0 auto;
  padding: 60px;
  gap: 40px;
  width: 100%;
}

.timeline-event {
  width: 100%;
}
</style>
