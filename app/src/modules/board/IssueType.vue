<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  type: string;
}>();

const color = computed(
  () =>
    ({
      story: 'strong-green',
      component: 'strong-purple',
      refactor: 'strong-green',
      task: 'strong-blue',
      refinement: 'strong-blue',
      bug: 'strong-red',
      quickfix: 'strong-orange',
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
