<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import draggable from 'vuedraggable';
import IconBigPlus from '@/lib/components/icons/IconBigPlus.vue';
import { SprintApi } from '@/lib/api/sprints.api';
import type { Sprint } from '@/lib/models/sprint.model';
import * as issueMutations from './issue-mutations';
import BacklogItem from './components/BacklogItem.vue';
import AddBacklogItem from './components/AddBacklogItem.vue';
import SprintCard from './components/SprintCard.vue';
import * as sprintMutations from './sprint-mutations';
import { requestApi } from '@/lib/utils/api';
import type { User } from '@/lib/models/user.model';
import type { Issue } from '@/lib/models/issue.model';

const sprintApi = new SprintApi();

const props = defineProps<{
  productId: number;
}>();

const sprints = ref<any[]>([]);
const editable = ref(false);

onMounted(async () => {
  sprints.value = await sprintApi.fetchSprints(props.productId);
});

async function createSprint() {
  const sprint = await requestApi(sprintApi.createSprint(props.productId, {}));
  sprint.issues = [];
  sprints.value.push(sprint);
}

async function removeSprint(id: number) {
  await requestApi(sprintApi.removeSprint(id));
  sprints.value = sprints.value.filter((s) => s.id !== id);
}

const patchSprint = async (i: number, sprint: Sprint, partial: Partial<Sprint>) => {
  sprints.value[i] = await requestApi(sprintMutations.patchSprint(sprint, partial));
  editable.value = false;
};

const startSprint = async (i: number, sprint: Sprint) =>
  (sprints.value[i] = await requestApi(sprintMutations.startSprint(sprint.id)));

const endSprint = async (i: number, sprint: Sprint) =>
  (sprints.value[i] = await requestApi(sprintMutations.endSprint(sprint.id)));

const addIssue = async (i: number, sprint: Sprint, data: Partial<Issue>) =>
  (sprint.issues = await sprintMutations.addIssue(sprint, data));

const removeIssue = async (sprint: Sprint, issue: Issue) =>
  (sprint.issues = await sprintMutations.removeIssue(sprint, issue));

const patchIssue = async (i: number, sprint: Sprint, partial: Partial<Issue>) =>
  (sprint.issues[i] = await issueMutations.patchIssue(sprint.issues[i], partial));

const addAssignee = async (i: number, sprint: Sprint, assignee: User) =>
  (sprint.issues[i] = await issueMutations.addAssignee(sprint.issues[i], assignee));

const removeAssignee = async (i: number, sprint: Sprint, assignee: User) =>
  (sprint.issues[i] = await issueMutations.removeAssignee(sprint.issues[i], assignee));

function moveSprint({ moved }: any) {
  if (moved) {
    sprintApi.moveSprint(moved.element.id, moved.newIndex);
  }
}

async function moveIssue(sprint: Sprint, { moved, added, removed }: any) {
  if (added) {
    let { id } = added.element;
    sprintApi.includeItem(sprint.id, { issueId: id, order: added.newIndex });
  }

  if (removed) {
    let { id } = removed.element;
    sprintApi.removeItem(sprint.id, id);
  }

  if (moved) {
    let { id } = moved.element;
    sprintApi.moveItem(sprint.id, id, moved.newIndex);
  }
}
</script>

<template>
  <div class="sprints">
    <draggable
      class="sprint-list"
      v-model="sprints"
      item-key="id"
      tag="ul"
      group="sprints"
      handle=".draggable-handle"
      @change="moveSprint"
    >
      <template #item="{ element: sprint, index: i }">
        <SprintCard
          :sprint="sprint"
          v-model:editable="editable"
          @patch="patchSprint(i, sprint, $event)"
          @remove="removeSprint(sprint.id)"
          @start-sprint="startSprint(i, sprint)"
          @end-sprint="endSprint(i, sprint)"
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
                  @remove="removeIssue(sprint, issue)"
                  @patch="patchIssue(j, sprint, $event)"
                  @add-assignee="addAssignee(j, sprint, $event)"
                  @remove-assignee="removeAssignee(j, sprint, $event)"
                />
              </template>
            </draggable>

            <AddBacklogItem @created="addIssue(i, sprint, $event)" />
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
  background-color: #f0f7ff;
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
  border-radius: 8px;
}
</style>

<style scoped>
.add-sprint {
  width: fit-content;
  margin: auto;
  margin-top: 40px;
  background-color: #bbcbdf;
  background: #8459ff;
  padding: 10px;
  border-radius: 20px;
  line-height: 0;
}
</style>
