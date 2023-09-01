<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import draggable from 'vuedraggable';
import { AxiosError } from 'axios';
import IconBigPlus from '@/lib/components/icons/IconBigPlus.vue';
import { createSprintsRepository } from '@/lib/service/sprints.service';
import { Alert } from '@/lib/utils/alert';
import type { Sprint } from '@/lib/models/sprint.model';
import { addAssignee, patchIssue, removeAssignee } from './issue-mutations';
import BacklogItem from './components/BacklogItem.vue';
import AddBacklogItem from './components/AddBacklogItem.vue';
import SprintCard from './components/SprintCard.vue';
import { addIssue, endSprint, patchSprint, removeIssue, startSprint } from './sprint-mutations';

const sprintsRepo = createSprintsRepository();

const props = defineProps<{
  productId: number;
}>();

const sprints = ref<any[]>([]);
const editable = ref(false);

onMounted(async () => {
  sprints.value = await sprintsRepo.fetchSprints(props.productId);
});

async function createSprint() {
  try {
    const sprint = await sprintsRepo.createSprint(props.productId, {});
    sprint.issues = [];
    sprints.value.push(sprint);
  } catch (ex) {
    if (ex instanceof AxiosError) Alert.error(ex.response?.data.message);
  }
}

async function removeSprint(id: number) {
  await sprintsRepo.removeSprint(id);
  sprints.value = sprints.value.filter((s) => s.id !== id);
}

function moveSprint({ moved }: any) {
  if (moved) {
    sprintsRepo.moveSprint(moved.element.id, moved.newIndex);
  }
}

async function moveIssue(sprint: Sprint, { moved, added, removed }: any) {
  if (added) {
    let { id } = added.element;
    sprintsRepo.includeItem(sprint.id, { issueId: id, order: added.newIndex });
  }

  if (removed) {
    let { id } = removed.element;
    sprintsRepo.removeItem(sprint.id, id);
  }

  if (moved) {
    let { id } = moved.element;
    sprintsRepo.moveItem(sprint.id, id, moved.newIndex);
  }
}
</script>

<template>
  <div class="sprints">
    <draggable
      v-model="sprints"
      class="sprint-list"
      tag="ul"
      group="sprints"
      handle=".draggable-handle"
      @change="moveSprint"
    >
      <template #item="{ element: sprint, index: i }">
        <SprintCard
          :sprint="sprint"
          v-model:editable="editable"
          @patch="async (p) => (sprints[i] = await patchSprint(sprint, p))"
          @remove="removeSprint(sprint.id)"
          @start-sprint="async () => (sprints[i] = await startSprint(sprint.id))"
          @end-sprint="async () => (sprints[i] = await endSprint(sprint.id))"
          #default="{ hideIssues }"
        >
          <div class="sprint-issues" :class="{ hide: hideIssues }">
            <draggable
              class="sprint-backlog"
              v-model="sprints[i].issues"
              item-key="id"
              data-dropzone="sprint"
              handle=".draggable-handle"
              group="issues"
              @change="(e) => moveIssue(sprint, e)"
            >
              <template #item="{ element: issue, index: j }">
                <BacklogItem
                  :issue="issue"
                  @remove="async () => (sprint.issues = await removeIssue(sprint, issue))"
                  @patch="async (e) => (sprint.issues[j] = await patchIssue(issue, e))"
                  @add-assignee="async (e) => (sprint.issues[j] = await addAssignee(issue, e))"
                  @remove-assignee="
                    async (e) => (sprint.issues[j] = await removeAssignee(issue, e))
                  "
                />
              </template>
            </draggable>

            <AddBacklogItem
              @created="async (data) => (sprint.issues = await addIssue(sprint, data))"
            />
          </div>
        </SprintCard>
      </template>
    </draggable>

    <div class="add-sprint" @click="createSprint">
      <IconBigPlus />
    </div>
  </div>
</template>

<style lang="sass" scoped>
.sprints
  margin-bottom: 20px

.sprint-list .sprint
  margin-bottom: 10px
</style>

<style scoped>
.sprint-issues {
  margin-top: 5px;
  background: #f6faff;
  border-radius: 8px;
  padding: 5px;
}

.sprint-issues.hide {
  display: none;
}

.issue-placeholder {
  color: #777;
  padding: 0 10px;
}

.sprint-backlog {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 5px;

  background: #f6faff;
  border-radius: 8px;
}
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
