<script lang="ts" setup>
import IconLike from '@/lib/components/icons/IconLike.vue';
import IconLiked from '@/lib/components/icons/IconLiked.vue';

const props = defineProps<{
  count: number,
  liked: boolean,
}>();

const emit = defineEmits(["toggled"]);

function toggle() {
  const liked = !props.liked;
  const count = liked ? props.count + 1 : props.count - 1;
  emit('toggled', [liked, count]);
}
</script>

<template>
  <div class="like-button" @click="toggle">
    <IconLiked v-if="liked"/>
    <IconLike v-else/>
    <span>{{count}}</span>
  </div>
</template>

<style scoped>
.like-button {
  display: flex;
  gap: 5px;
}
</style>
