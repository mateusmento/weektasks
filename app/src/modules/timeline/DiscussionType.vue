<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  type: string;
}>();

const color = computed(
  () =>
    ({
      progress: 'light-green',
      feedback: 'light-blue',
      dicussion: 'light-blue',
      decision: 'light-purple',
      blocker: 'strong-red',
    })[props.type]
);
</script>

<template>
  <div class="badge" :class="color">{{ type }}</div>
</template>

<style scoped>
.badge {
  text-transform: capitalize;
}
</style>
