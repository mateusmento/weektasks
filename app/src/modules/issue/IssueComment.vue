<script lang="ts" setup>
import { ref } from 'vue';
import { vOnClickOutside } from '@vueuse/components';
import { envs } from '@/lib/utils/envs';
import LikeButton from '../timeline/LikeButton.vue';

const props = defineProps<{
  comment: any;
}>();

const emit = defineEmits(['remove', 'patch', 'update:comment']);

const showOptions = ref(false);
const isEditting = ref(false);
const text = ref('');

function remove() {
  showOptions.value = false;
  emit('remove', props.comment.id);
}

function startEditing() {
  showOptions.value = false;
  isEditting.value = true;
  text.value = props.comment.text;
}

function sendEditing() {
  isEditting.value = false;
  const partial = { text: text.value };
  emit('update:comment', { ...props.comment, ...partial });
  emit('patch', partial, props.comment.id);
  text.value = '';
}
</script>

<template>
  <div class="comment card">
    <div class="top-section">
      <img class="user-photo" :src="`${envs.API_BASE_URL}/users/${comment.author.id}/photo`" />

      <div class="flex-vert-md spacer">
        <div class="comment-author">{{ comment.author.name }}</div>
        <div class="comment-text" v-if="!isEditting">
          <pre>{{ comment.text }}</pre>
        </div>
        <form v-else @submit.prevent="sendEditing">
          <textarea v-model="text"></textarea>
          <div class="comment-actions">
            <button type="button" class="small" @click="isEditting = false">Cancel</button>
            <button type="submit" class="small">Send</button>
          </div>
        </form>
        <div class="footer">
          <LikeButton :liked="false" :count="10" />
          <div>Reply</div>
          <RouterLink to="">
            <button class="light-purple" hover>See Discussion</button>
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
  font-size: 12px;
  padding: 2px 7px;
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
