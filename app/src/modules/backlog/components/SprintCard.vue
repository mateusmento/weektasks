<script lang="ts" setup>
import WkEditable from '@/lib/components/form/WkEditable.vue';
import IconArrowDown from '@/lib/components/icons/IconArrowDown.vue';
import IconEdit from '@/lib/components/icons/IconEdit.vue';
import IconTrash from '@/lib/components/icons/IconTrash.vue';
import type { Sprint } from '@/lib/models/sprint.model';
import moment from 'moment';
import { computed, reactive, ref } from 'vue';

let props = defineProps<{
  sprint: Sprint;
  editable: boolean;
}>();

let emit = defineEmits<{
  (e: 'update:editable', value: boolean): void;
  (e: 'patch', partial: Partial<Sprint>): void;
  (e: 'remove', id: number): void;
  (e: 'start-sprint', id: number): void;
  (e: 'end-sprint', id: number): void;
}>();

let title = ref(props.sprint.title);
let hideIssues = ref(false);

const state = reactive({
  editable: props.editable,
});

let editable = computed({
  get: () => props.editable ?? state.editable,
  set: (value) => {
    state.editable = value;
    emit('update:editable', value);
  },
});

async function updateTitle() {
  emit('patch', { title: title.value });
}

async function remove(id: number) {
  emit('remove', id);
}

async function start() {
  emit('start-sprint', props.sprint.id);
}

async function end() {
  emit('end-sprint', props.sprint.id);
}
</script>

<template>
  <div class="sprint card" :class="{ 'draggable-handle': !editable }">
    <div class="sprint-card__header">
      <WkEditable class="title small" v-model="title" :editable="editable" />

      <IconEdit v-if="!editable" @click="editable = true" title="Edit sprint" />
      <template v-else>
        <span @click="updateTitle" title="Confirm edit">
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

      <IconTrash @click="remove(sprint.id)" title="Delete sprint" />

      <span class="period ml-2">
        {{ moment.utc(sprint.startedAt).format('MMM DD') }}
        to
        {{ moment.utc(sprint.endedAt).format('MMM DD') }}
      </span>

      <div class="spacer"></div>

      <button v-if="sprint.hasntStarted" class="start-sprint" pill @click="start">
        Start Sprint
      </button>
      <button v-if="sprint.isOnGoing" class="start-sprint" pill @click="end">End Sprint</button>

      <div class="ml-4" @click="hideIssues = !hideIssues">
        <IconArrowDown class="icon-arrow" :class="{ 'arrow-rotated': !hideIssues }" />
      </div>
    </div>

    <div class="sprint-card__content" :class="{ hide: hideIssues }">
      <slot :hideIssues="hideIssues" />
    </div>
  </div>
</template>

<style scoped>
.sprint {
  /* width: 650px; */
  padding: 15px;
  border-radius: 10px;
}

.sprint-card__header {
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
}

.sprint-card__content {
  margin-top: 10px;
  padding: 5px;
  border-radius: 8px;
  background: #f6faff;
  background-color: #f0f7ff;
}

.sprint-card__content.hide {
  display: none;
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
  background: #8459ff;
  border-radius: 5px;
  padding: 5px;
  color: white;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}
</style>
