<template>
  <div class="sprints">
    <draggable
      v-model="sprints"
      class="sprint-list"
      item-key="id"
      tag="ul"
      group="sprints"
      handle=".draggable-handle"
      @change="moveSprint"
    >
      <template #item="{ element: sprint, index: i }">
        <li>
          <Sprint v-model:sprint="sprints[i]" @remove="removeSprint(sprint.id)" />
        </li>
      </template>
    </draggable>

    <div class="add-sprint" @click="createSprint">
      <IconBigPlus />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import Sprint from './Sprint.vue';
import draggable from 'vuedraggable';
import { useRoute } from 'vue-router';
import { AxiosError } from 'axios';
import IconBigPlus from '@/lib/components/icons/IconBigPlus.vue';
import { createSprintsRepository } from '@/lib/service/sprints.service';
import { Alert } from '@/lib/utils/alert';

const route = useRoute();
const productId = computed(() => route.params.id);

const sprintTitle = ref('');
const sprints = ref<any[]>([]);

const sprintsRepo = createSprintsRepository();

onMounted(async () => {
  sprints.value = await sprintsRepo.fetchSprints(+productId.value);
});

async function createSprint() {
  try {
    const sprint = await sprintsRepo.createSprint(+productId.value, { title: sprintTitle.value });
    sprint.issues = [];
    sprints.value.push(sprint);
    sprintTitle.value = '';
  } catch (ex) {
    if (ex instanceof AxiosError) Alert.error(ex.response?.data.message);
  }
}

async function removeSprint(id: number) {
  sprints.value = sprints.value.filter((s) => s.id !== id);
}

function moveSprint({ moved }: any) {
  if (moved) {
    sprintsRepo.moveSprint(moved.element.id, moved.newIndex);
  }
}
</script>

<style lang="sass" scoped>
.sprints
  margin-bottom: 20px

.sprint-list .sprint
  margin-bottom: 10px
</style>

<style scoped>
.add-sprint {
  width: fit-content;
  margin: auto;
  margin-top: 40px;
  background-color: #bbcbdf;
  padding: 10px;
  border-radius: 20px;
  line-height: 0;
}
</style>
