<script lang="ts" setup>
import type { Issue } from '@/lib/models/issue.model';
import { createBacklogRepository } from '@/lib/service/backlog.service';
import { Alert } from '@/lib/utils/alert';
import { AxiosError } from 'axios';
import { computed, onMounted, ref } from 'vue';
import draggable from 'vuedraggable';
import AddBacklogItem from './components/AddBacklogItem.vue';
import BacklogItem from './components/BacklogItem.vue';
import { patchIssue, addAssignee, removeAssignee } from './issue-mutations';

const props = defineProps<{
  productId: number;
}>();

const backlogRepo = computed(() => createBacklogRepository(props.productId));

const backlogItems = ref<Issue[]>([]);

onMounted(async () => {
  backlogItems.value = await backlogRepo.value.fetchBacklogItems();
});

async function createBacklogItem(data: any) {
  try {
    let item = await backlogRepo.value.createIssue(data);
    backlogItems.value = [...backlogItems.value, item];
  } catch (ex) {
    if (ex instanceof AxiosError) Alert.error(ex.response?.data.message);
    throw ex;
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
      <template #item="{ element: issue, index: i }">
        <li>
          <BacklogItem
            :issue="issue"
            @patch="async (e) => (backlogItems[i] = await patchIssue(issue, e))"
            @remove="removeIssue"
            @add-assignee="async (e) => (backlogItems[i] = await addAssignee(issue, e))"
            @remove-assignee="async (e) => (backlogItems[i] = await removeAssignee(issue, e))"
          />
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
</style>
