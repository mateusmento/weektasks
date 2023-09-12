<script lang="ts" setup>
import { DiscussionService } from '@/modules/timeline/discussion.service';
import { vOnClickOutside } from '@vueuse/components';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import DiscussionType from './DiscussionType.vue';
import { requestApi } from '@/lib/utils/api';

const emit = defineEmits(['created']);
const route = useRoute();

const discussionService = new DiscussionService();
const text = ref('');
const type = ref('progress');
const showStatusOptions = ref(false);

async function createDiscussion() {
  const data = { text: text.value, type: type.value };
  const discussion = await requestApi(discussionService.createDiscussion(+route.params.id, data));
  emit('created', discussion);
  text.value = '';
}

function selectDiscussionType(t: string) {
  type.value = t;
  showStatusOptions.value = false;
}
</script>

<template>
  <div class="create-post flex-vert gap-md">
    <form class="create-discussion" @submit.prevent="createDiscussion">
      <textarea v-model="text" rows="3" placeholder="Give a feedback..."></textarea>
      <button>Send</button>
    </form>
    <div class="footer">
      <div
        class="dropdown"
        :class="{ active: showStatusOptions }"
        v-on-click-outside="() => (showStatusOptions = false)"
      >
        <DiscussionType :type="type" @click="showStatusOptions = !showStatusOptions" />
        <ul class="dropdown-menu menu list">
          <li class="menu-item" @click="selectDiscussionType('decision')">
            <DiscussionType type="decision" />
          </li>
          <li class="menu-item" @click="selectDiscussionType('progress')">
            <DiscussionType type="progress" />
          </li>
          <li class="menu-item" @click="selectDiscussionType('feedback')">
            <DiscussionType type="feedback" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-discussion {
  display: flex;
  align-items: flex-start;
  background: #e7e8ff;
  border-radius: 10px;
  padding: 15px;
  gap: 10px;
  border: 2px solid transparent;
}

.create-discussion:focus-within {
  border-color: #8459ff;
}

textarea {
  padding: 0;
  border: none;
  color: #8459ff;
  background-color: unset;
  flex: 1;
  font-size: 14px;
  outline: none;
  resize: none;
}

textarea::placeholder {
  color: #8459ff;
}

button {
  background: #8459ff;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px;
}

.footer {
  margin-left: 10px;
}
</style>
