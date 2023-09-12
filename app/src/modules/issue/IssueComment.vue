<script lang="ts" setup>
import { ref } from 'vue';
import { vOnClickOutside } from '@vueuse/components';
import { envs } from '@/lib/utils/envs';
import LikeButton from '../timeline/LikeButton.vue';
import type { IssueComment } from '@/lib/models/issue.model';

const props = defineProps<{
  comment: IssueComment;
}>();

const emit = defineEmits(['update:comment', 'patch', 'remove']);

const showOptions = ref(false);
const editable = ref(false);
const text = ref('');

function patch(partial: Partial<IssueComment>) {
  emit('update:comment', { ...props.comment, ...partial });
  emit('patch', partial, props.comment.id);
}

function remove() {
  showOptions.value = false;
  emit('remove', props.comment);
}

function startEditing() {
  text.value = props.comment.text;
  showOptions.value = false;
  editable.value = true;
}

function confirmEditing() {
  patch({ text: text.value });
  editable.value = false;
}

function cancelEditing() {
  text.value = props.comment.text;
  editable.value = false;
}
</script>

<template>
  <div class="comment card">
    <div class="top-section">
      <img class="user-photo" :src="`${envs.API_BASE_URL}/users/${comment.author.id}/photo`" />

      <div class="flex-vert-md spacer">
        <div class="comment-author">{{ comment.author.name }}</div>
        <div class="comment-text" v-if="!editable">
          <pre>{{ comment.text }}</pre>
        </div>
        <form v-else @submit.prevent="confirmEditing">
          <textarea v-model="text"></textarea>
          <div class="comment-actions">
            <button type="submit" class="primary">Send</button>
            <button type="button" class="secondary" @click="cancelEditing">Cancel</button>
          </div>
        </form>
        <div class="footer">
          <LikeButton :liked="false" :count="10" />
          <div>Reply</div>
          <RouterLink to="">
            <button class="small light-purple" hover>See Discussion</button>
          </RouterLink>
        </div>
      </div>

      <div
        class="dropdown"
        :class="{ active: showOptions }"
        v-on-click-outside="() => (showOptions = false)"
      >
        <div class="dropdown-toggle" @click="showOptions = !showOptions">
          <el-icon><MoreFilled /></el-icon>
        </div>
        <ul class="dropdown-menu menu list">
          <li class="menu-item" @click="startEditing">Edit</li>
          <li class="menu-item" @click="remove">Remove</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  border-radius: 5px;
}
</style>

<style lang="sass" scoped>
.comment
  padding: 10px


.top-section
  display: flex
  gap: 20px

.comment-author
  flex: 1
  // font-weight: 600
  font-size: 14px
  // font-size: 1.1rem

.comment-text
  font-size: 16px

.dropdown-toggle
  background: white
  padding: 5px
  cursor: pointer

.menu
  right: 0
  margin-top: 5px

.comment-actions
  display: flex
  justify-content: flex-end
  gap: 5px
  margin-top: 10px

.user-photo
  width: 40px
  align-self: flex-start
</style>
