<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  direction: string,
  gap: string,
}>();

const classes = computed(() => ({
  [`flex-${props.direction || 'horz'}`]: true,
  [`gap-${props.gap || 'md'}`]: true,
}));
</script>

<template>
  <div class="autolayout" :class="classes">
    <slot></slot>
  </div>
</template>

<style lang="sass" scoped>
.autolayout
  display: flex
</style>
