<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import draggable from 'vuedraggable';
import { useRoute } from 'vue-router';
import BacklogItem from '../components/BacklogItem.vue';
import AddBacklogItem from '../components/AddBacklogItem.vue';
import { AxiosError } from 'axios';
import { createBacklogRepository } from '@/lib/service/backlog.service';
import { Alert } from '@/lib/utils/alert';

const route = useRoute();
const productId = computed(() => route.params.id);

const backlogItems = ref<any[]>([]);

const backlogRepo = computed(() => createBacklogRepository(+productId.value));

onMounted(async () => {
  backlogItems.value = await backlogRepo.value.fetchBacklogItems();
});

async function createBacklogItem(createItemData: any) {
  try {
    let item = await backlogRepo.value.createIssue(createItemData);
    backlogItems.value.push(item);
  } catch (ex) {
    if (ex instanceof AxiosError) Alert.error(ex.response?.data.message);
  }
}

async function removeIssue(id: number) {
  await backlogRepo.value.removeIssue(id);
  backlogItems.value = backlogItems.value.filter((i) => i.id !== id);
}

function canMoveBacklogItemToSprint({ relatedContext }: any) {
  let dropzone = relatedContext.component.$attrs['data-dropzone'];
  // dropzone === undefined seems to happen when moving an item inside a dropzone
  return dropzone === undefined || dropzone === 'sprint';
}

function moveBacklogItem({ moved, added, removed }: any) {
  if (added) {
    const { id } = added.element;
    const item = { issueId: id, order: added.newIndex };
    backlogRepo.value.includeItem(item);
  }

  if (removed) {
    backlogRepo.value.removeItem(removed.element.id);
  }

  if (moved) {
    backlogRepo.value.moveItem(moved.element.id, moved.newIndex);
  }
}
</script>

<template>
  <div class="backlog">
    <draggable
      class="backlog-items"
      v-model="backlogItems"
      item-key="id"
      tag="ul"
      handle=".draggable-handle"
      group="issues"
      :move="canMoveBacklogItemToSprint"
      @change="moveBacklogItem"
    >
      <template #item="{ element: backlogItem, index: i }">
        <li>
          <BacklogItem v-model:issue="backlogItems[i]" @remove="removeIssue" />
        </li>
      </template>
    </draggable>

    <AddBacklogItem @created="createBacklogItem" />
  </div>
</template>

<style lang="scss" scoped>
.backlog {
  background: #f0f7ff;
  border-radius: 8px;
  padding: 5px;
}

.backlog-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.backlog-title {
  margin-bottom: 20px;
}
</style>
