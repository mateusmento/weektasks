<script lang="ts" setup>
import { axios } from '@/lib/axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Issue } from '@/lib/models/issue.model';
import type { Sprint } from '@/lib/models/sprint.model';
import draggable from 'vuedraggable';
import { SprintApi } from '@/lib/api/sprints.api';
import { IssueApi } from '@/lib/api/issues.api';
import IssueCard from './IssueCard.vue';
import CardList from './CardList.vue';
import { requestApi } from '@/lib/utils/api';

const route = useRoute();
const router = useRouter();

interface Board {
  sprint: Sprint;
  issues: {
    todo: Issue[];
    doing: Issue[];
    done: Issue[];
  };
}

const board = ref<Board>();

const sprintApi = new SprintApi();
const issueApi = new IssueApi();

onMounted(async () => {
  board.value = await requestApi(fetchBoard(+route.params.id));
});

function fetchBoard(id: number) {
  return axios.get<Board>(`/products/${id}/board`).then((res) => res.data);
}

async function endSprint() {
  if (!board.value) return;
  await requestApi(sprintApi.endSprint(board.value.sprint.id));
  router.push({ name: 'backlog' });
}

async function moveTodoItems({ added }: any) {
  if (added) {
    const data = await issueApi.patchIssue(added.element.id, { status: 'todo' });
    if (board.value) board.value.issues.todo[added.newIndex] = { ...added.element, ...data };
  }
}

async function moveDoingItems({ added }: any) {
  if (added) {
    const data = await issueApi.patchIssue(added.element.id, { status: 'doing' });
    if (board.value) board.value.issues.doing[added.newIndex] = { ...added.element, ...data };
  }
}

async function moveDoneItems({ added }: any) {
  if (added) {
    const data = await issueApi.patchIssue(added.element.id, { status: 'done' });
    if (board.value) board.value.issues.done[added.newIndex] = { ...added.element, ...data };
  }
}
</script>

<template>
  <main v-if="board" class="board-view">
    <section class="top-section">
      <div>
        <h2>Sprint Board</h2>
        <div>{{ board.sprint.title }}</div>
      </div>
      <button class="end-sprint" @click="endSprint">Complete Sprint</button>
    </section>

    <section class="content-section">
      <CardList :issues="board.issues.todo" title="Backlog">
        <draggable
          v-model="board.issues.todo"
          item-key="id"
          handle=".draggable-handle"
          group="issues"
          @change="moveTodoItems"
          :component-data="{ class: 'draggable' }"
        >
          <template #item="{ index: i }">
            <IssueCard v-model:issue="board.issues.todo[i]" />
          </template>
        </draggable>
      </CardList>

      <CardList :issues="board.issues.doing" title="In Progress">
        <draggable
          v-model="board.issues.doing"
          item-key="id"
          handle=".draggable-handle"
          group="issues"
          @change="moveDoingItems"
          :component-data="{ class: 'draggable' }"
        >
          <template #item="{ index: i }">
            <IssueCard v-model:issue="board.issues.doing[i]" />
          </template>
        </draggable>
      </CardList>

      <CardList :issues="board.issues.done" title="Done">
        <draggable
          v-model="board.issues.done"
          item-key="id"
          handle=".draggable-handle"
          group="issues"
          @change="moveDoneItems"
          :component-data="{ class: 'draggable' }"
        >
          <template #item="{ index: i }">
            <IssueCard v-model:issue="board.issues.done[i]" />
          </template>
        </draggable>
      </CardList>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.board-view {
  display: flex;
  flex-direction: column;
  padding: 60px;
  padding-bottom: 20px;
  flex: 1;
}

.draggable {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-section {
  display: flex;
  margin-bottom: 20px;
}

.end-sprint {
  display: block;
  margin-left: auto;
  padding: 10px 20px;
  border-radius: 10px;
  background: #8459ff;
  // background: #6b4ae1;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

.content-section {
  flex: 1;

  display: flex;
  gap: 20px;
  width: 100%;
}

.content > div {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.issue-card {
  box-shadow: 0 0 1px rgba(#000, 0.25);
}

.card-list {
  flex: 1;
}
</style>
