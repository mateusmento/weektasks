<script lang="ts" setup>
import { DiscussionApi } from '@/modules/timeline/discussion.api';
import { onMounted, ref } from 'vue';
import CreateDiscussion from './CreateDiscussion.vue';
import Discussion from './Discussion.vue';
import { ProductApi } from '@/lib/api/products.api';
import type { Collaborator } from '../products/product.model';
import { envs } from '@/lib/utils/envs';
import Collaborators from './Collaborators.vue';
import Messaging from './messaging/Messaging.vue';
import DiscussionView from './DiscussionView.vue';
import type { User } from '@/lib/models/user.model';

const props = defineProps<{
  id: string;
}>();

const discussionApi = new DiscussionApi();
const discussions = ref<any[]>([]);

const viewingDiscussion = ref<any>(null);
const chattingUser = ref<User | null>(null);
const viewType = ref<'chat' | 'discussion' | null>(null);

const productApi = new ProductApi();
const collaborators = ref<Collaborator[]>([]);

onMounted(async () => {
  discussions.value = await discussionApi.findDiscussions(+props.id, 1, 10);
  collaborators.value = await productApi.fetchCollaborators(props.id);
});

function addDiscussion($event: any) {
  discussions.value.unshift($event);
}

function chatWith(user: User) {
  chattingUser.value = user;
  viewType.value = 'chat';
}

function viewDiscussion(discussion: any) {
  viewingDiscussion.value = discussion;
  viewType.value = 'discussion';
}
</script>

<template>
  <main>
    <section class="discussions-section">
      <div class="discussions-section__header">
        <CreateDiscussion @created="addDiscussion" class="p-lg" />
        <ul class="collaborators">
          <li
            v-for="collab of collaborators"
            :key="collab.id"
            class="collab"
            @click="chatWith(collab.user)"
          >
            <img :src="`${envs.API_BASE_URL}/users/${collab.user.id}/photo`" />
            <div>{{ collab.user.name }}</div>
          </li>
        </ul>
      </div>
      <ul class="discussions">
        <li v-for="(discussion, i) in discussions" :key="discussion.id">
          <Discussion
            v-model:discussion="discussions[i]"
            :productId="+id"
            :replies="discussions[i].replies"
            class="p-md"
            @view="viewDiscussion"
          />
        </li>
        <li class="bottom-item"></li>
      </ul>
    </section>
    <section class="chat-section p-lg">
      <Messaging v-if="viewType === 'chat'" />
      <DiscussionView
        v-else-if="viewType === 'discussion'"
        v-model:discussion="viewingDiscussion"
        :productId="+id"
      />
    </section>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  flex: 1;
}

.create-post {
  padding-bottom: 0;
}

.collaborators {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
}

.collab {
  width: 60px;
}

.collab img {
  width: 100%;
}

.collab div {
  text-align: center;
  white-space: wrap;
}

.discussions-section {
  max-width: 640px;
  overflow-y: auto;

  display: flex;
  flex-direction: column;

  background-color: white;
  border-right: 1px solid #ccc;
}

.discussions-section {
  border-radius: 40px 0 0 40px;
}
.chat-section {
  border-radius: 0 40px 40px 0;
}

.discussions-section__header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  border-bottom: 1px solid #ccc;
}

.discussions {
  ul {
    border: none;
  }

  li:not(:last-of-type) {
    border-bottom: 1px solid #ccc;
  }
}

.bottom-item {
  height: 30px;
}

.chat-section {
  background-color: #fff;
  flex: 1;
}
</style>
