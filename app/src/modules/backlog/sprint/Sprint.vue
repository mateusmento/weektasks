<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Sprint } from '@/lib/models/sprint.model';
import WkEditable from '@/lib/components/form/WkEditable.vue';
import SprintIssues from './SprintIssues.vue';
import { createSprintsRepository } from '@/lib/service/sprints.service';
import { AxiosError } from 'axios';
import IconArrowDown from '@/lib/components/icons/IconArrowDown.vue';
import IconArrowUp from '@/lib/components/icons/IconArrowDown.vue';
import IconTrash from '@/lib/components/icons/IconTrash.vue';
import IconEdit from '@/lib/components/icons/IconEdit.vue';
import moment from 'moment';
import { Alert } from '@/lib/utils/alert';

let props = defineProps<{
  sprint: Sprint;
}>();

let emit = defineEmits(['remove', 'update:sprint']);

let sprintTitle = computed({
  get: () => props.sprint.title,
  set: (title) => emit('update:sprint', { ...props.sprint, title }),
});

function updateSprint(patch: Partial<Sprint>) {
  emit('update:sprint', { ...props.sprint, ...patch });
}

let hideIssues = ref(false);

let editable = ref(false);

const sprintsRepo = createSprintsRepository();

async function updateSprintTitle() {
  let patch = { title: sprintTitle.value };
  await sprintsRepo.patchSprint(props.sprint.id, patch);
  editable.value = false;
}

async function removeSprint(id: number) {
  await sprintsRepo.removeSprint(id);
  emit('remove', id);
}

async function startSprint(sprintId: number) {
  try {
    const sprint = await sprintsRepo.startSprint(sprintId);
    updateSprint({ hasntStarted: sprint.hasntStarted, isOnGoing: sprint.isOnGoing });
  } catch (ex) {
    if (ex instanceof AxiosError) Alert.error(ex.response?.data.message);
    else throw ex;
  }
}

async function endSprint(sprintId: number) {
  try {
    const sprint = await sprintsRepo.endSprint(sprintId);
    updateSprint({ isOnGoing: sprint.isOnGoing, hasEnded: sprint.hasEnded });
  } catch (ex) {
    if (ex instanceof AxiosError) Alert.error(ex.response?.data.message);
    else throw ex;
  }
}
</script>

<template>
  <div class="sprint card" :class="{ 'draggable-handle': !editable }">
    <div class="topbar">
      <WkEditable class="title small" v-model="sprintTitle" :editable="editable" />

      <IconEdit v-if="!editable" @click="editable = !editable" title="Edit sprint" />
      <template v-else>
        <span @click="updateSprintTitle" title="Confirm edit">
          <el-icon>
            <Check />
          </el-icon>
        </span>
        <span @click="editable = false" title="Cancel edit">
          <el-icon>
            <Close />
          </el-icon>
        </span>
      </template>

      <IconTrash @click="removeSprint(sprint.id)" title="Delete sprint" />

      <span class="period ml-2">
        {{ moment.utc(sprint.startedAt).format('MMM DD') }}
        to
        {{ moment.utc(sprint.endedAt).format('MMM DD') }}
      </span>

      <div class="spacer"></div>

      <button v-if="sprint.hasntStarted" class="start-sprint" pill @click="startSprint(sprint.id)">
        Start Sprint
      </button>
      <button v-if="sprint.isOnGoing" class="start-sprint" pill @click="endSprint(sprint.id)">
        End Sprint
      </button>

      <div class="ml-4" @click="hideIssues = !hideIssues">
        <IconArrowDown class="icon-arrow" :class="{ 'arrow-rotated': !hideIssues }" />
      </div>
    </div>

    <SprintIssues
      v-if="!hideIssues"
      :sprint="sprint"
      @update:sprint="emit('update:sprint', $event)"
    />
  </div>
</template>

<style scoped>
.sprint {
  width: 650px;
  padding: 15px;
  border-radius: 10px;
}

.topbar {
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
}

.icon-arrow {
  transition: 300ms;
  cursor: pointer;
}

.arrow-rotated {
  transform: rotate(180deg);
}

.period {
  font-size: 10px;
  color: #aaa;
  white-space: nowrap;
}

.start-sprint {
  display: block;
  margin-left: auto;
  background: #773bc3;
  border-radius: 5px;
  padding: 5px;
  color: white;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.issues {
  margin-top: 10px;
}

.sprint-backlog {
  display: flex;
  flex-direction: column;
  padding: 5px;
  gap: 2px;

  background: #f6faff;
  border-radius: 8px;
}
</style>
