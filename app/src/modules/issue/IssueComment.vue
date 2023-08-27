<script lang="ts" setup>
import { ref } from 'vue';
import { vOnClickOutside } from '@vueuse/components';

const props = defineProps<{
  comment: any
}>();

const emit = defineEmits(['remove', 'edit', 'update:comment']);

const showOptions = ref(false);
const isEditting = ref(false);
const commentText = ref('');

function remove() {
  showOptions.value = false;
  emit('remove', props.comment.id);
}

function startEditing() {
  showOptions.value = false;
  isEditting.value = true;
  commentText.value = props.comment.text;
}

function sendEditing() {
  isEditting.value = false;
  emit('update:comment', {...props.comment, text: commentText.value});
  emit("edit", props.comment.id, commentText.value);
  commentText.value = '';
}
</script>

<template>
  <div class="comment card">
    <div class="top-section">
      <b class="comment-author">{{comment.author.name}}</b>
      <div class="dropdown" :class="{active: showOptions}" v-on-click-outside="() => showOptions = false">
        <div class="dropdown-toggle" @click="showOptions = !showOptions">
          <el-icon><MoreFilled/></el-icon>
        </div>
        <ul class="dropdown-menu menu list">
          <li class="menu-item" @click="startEditing">Edit</li>
          <li class="menu-item" @click="remove">Remove</li>
        </ul>
      </div>
    </div>
    <div v-if="!isEditting">
      <pre>{{ comment.text }}</pre>
    </div>
    <form v-else @submit.prevent="sendEditing">
      <textarea v-model="commentText"></textarea>
      <div class="comment-actions">
        <button type="button" class="small" @click="isEditting = false">Cancel</button>
        <button type="submit" class="small">Send</button>
      </div>
    </form>
  </div>
</template>

<style lang="sass" scoped>
.top-section
  display: flex
  margin-bottom: 10px

.comment-author
  flex: 1

.dropdown-toggle
  background: white
  padding: 5px
  border-radius: 20px
  border: 1px solid rgb(16, 95, 174)
  cursor: pointer

.menu
  right: 0
  margin-top: 5px

.comment-actions
  display: flex
  justify-content: flex-end
  gap: 5px
  margin-top: 10px
</style>
