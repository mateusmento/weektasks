<script lang="ts" setup>
import { axios } from '@/lib/axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Issue } from '@/lib/models/issue.model';
import type { Sprint } from '@/lib/models/sprint.model';
import draggable from 'vuedraggable';
import { AxiosError } from 'axios';
import { createSprintsRepository } from '@/lib/service/sprints.service';
import { createIssuesRepository } from '@/lib/service/issues.service';
import IssueCard from './IssueCard.vue';
import CardList from './CardList.vue';

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

const sprintsRepo = createSprintsRepository();
const issuesRepo = createIssuesRepository();

onMounted(async () => {
  try {
    board.value = await fetchBoard(+route.params.id);
  } catch (ex) {
    if (ex instanceof AxiosError) alert(ex.response?.data.message);
  }
});

function fetchBoard(id: number) {
  return axios.get<Board>(`/products/${id}/board`).then((res) => res.data);
}

async function endSprint() {
  try {
    if (!board.value) return;
    await sprintsRepo.endSprint(board.value.sprint.id);
    router.push({ name: 'backlog' });
  } catch (ex) {
    if (ex instanceof AxiosError) alert(ex.response?.data.message);
    else throw ex;
  }
}

async function moveTodoItems({ added }: any) {
  if (added) {
    const data = await issuesRepo.patchIssue(added.element.id, { status: 'todo' });
    if (board.value) board.value.issues.todo[added.newIndex] = { ...added.element, ...data };
  }
}

async function moveDoingItems({ added }: any) {
  if (added) {
    const data = await issuesRepo.patchIssue(added.element.id, { status: 'doing' });
    if (board.value) board.value.issues.doing[added.newIndex] = { ...added.element, ...data };
  }
}

async function moveDoneItems({ added }: any) {
  if (added) {
    const data = await issuesRepo.patchIssue(added.element.id, { status: 'done' });
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
        >
          <template #item="{ element: item, index: i }">
            <IssueCard v-model:issue="board.issues.todo[i]" />
          </template>
          <template #footer v-if="board.issues.todo.length === 0">
            <small class="issue-placeholder">
              <i>Move an issue here</i>
            </small>
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
        >
          <template #item="{ element: item, index: i }">
            <IssueCard v-model:issue="board.issues.doing[i]" />
          </template>
          <template #footer v-if="board.issues.doing.length === 0">
            <small class="issue-placeholder">
              <i>Move an issue here</i>
            </small>
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
        >
          <template #item="{ element: item, index: i }">
            <IssueCard v-model:issue="board.issues.done[i]" />
          </template>
          <template #footer v-if="board.issues.done.length === 0">
            <small class="issue-placeholder">
              <i>Move an issue here</i>
            </small>
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

.top-section {
  display: flex;
  margin-bottom: 20px;
}

.end-sprint {
  display: block;
  margin-left: auto;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: #773bc3;
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
  box-shadow: 0 1px 3px rgba(#000, 0.25);
}

.card-list {
  flex: 1;
}
</style>
