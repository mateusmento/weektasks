<script lang="ts" setup>
import { DiscussionApi } from '@/modules/timeline/discussion.api';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import CreateDiscussion from './CreateDiscussion.vue';
import Discussion from './Discussion.vue';
import CollaboratorsView from '../collaborators/CollaboratorsView.vue';

const route = useRoute();

const discussionApi = new DiscussionApi();
const discussions = ref<any[]>([]);

onMounted(async () => {
  discussions.value = await discussionApi.findDiscussions(+route.params.id, 1, 10);
});

function addDiscussion($event: any) {
  discussions.value.unshift($event);
}
</script>

<template>
  <main class="timeline-view">
    <div class="flex-vert-lg p-lg">
      <ul class="list">
        <li>Timeline</li>
        <li>Backlog</li>
        <li>Calendar</li>
      </ul>
      <CollaboratorsView />
    </div>
    <div style="min-height: 0px">
      <div class="discussions">
        <CreateDiscussion @created="addDiscussion" class="p-lg" />
        <ul>
          <li v-for="(discussion, i) in discussions" :key="discussion.id">
            <Discussion v-model:discussion="discussions[i]" class="p-lg" />
          </li>
          <li class="bottom-item"></li>
        </ul>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.timeline-view {
  flex: 1;
  display: flex;
  overflow-y: hidden;
}

.discussions {
  display: flex;
  flex-direction: column;

  max-width: 640px;
  height: 100%;
  overflow-y: auto;

  background-color: white;

  border: 1px solid #ccc;
  border-top: none;
  border-bottom: none;
}

.discussions {
  ul {
    border: none;
  }

  li:first-of-type {
    border-top: 1px solid #ccc;
  }

  li:not(:last-of-type) {
    border-bottom: 1px solid #ccc;
  }
}

.bottom-item {
  height: 20px;
}
</style>
@/modules/timeline/discussion.api
