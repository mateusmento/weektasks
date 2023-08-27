<template>
  <div class="history-view">
    <ul>
      <li class="past-sprint" v-for="(sprint, i) of pastSprints" :key="sprint.id">
        <Sprint v-model:sprint="pastSprints[i]" @remove="removeSprint"/>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { createSprintsRepository } from '@/lib/service/sprints.service';
import type { Sprint as ISprint } from '@/lib/models/sprint.model';
import Sprint from '../backlog/sprint/Sprint.vue';

const props = defineProps<{
  id: string
}>();

const sprintsRepo = createSprintsRepository();

const pastSprints = ref<ISprint[]>([]);

onMounted(async () => {
  pastSprints.value = await sprintsRepo.fetchPastSprints(+props.id);
});

async function removeSprint(id: number) {
  pastSprints.value = pastSprints.value.filter((s) => s.id !== id);
}
</script>

<style lang="sass" scoped>
.past-sprint
  margin-bottom: 20px
</style>
