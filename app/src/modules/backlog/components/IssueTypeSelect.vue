<script lang="ts" setup>
import { computed, ref } from 'vue';
import IssueType from '@/modules/board/IssueType.vue';
import { vOnClickOutside } from '@vueuse/components';

defineProps<{
  type: string;
}>();

const emit = defineEmits(['update:type']);

const showIssueTypes = ref(false);

function selectIssueType(type: string) {
  emit('update:type', type);
  showIssueTypes.value = false;
}
</script>

<template>
  <div
    class="dropdown"
    :class="{ active: showIssueTypes }"
    v-on-click-outside="() => (showIssueTypes = false)"
  >
    <IssueType class="issue-type" :type="type" @click="showIssueTypes = !showIssueTypes" />
    <ul class="dropdown-menu menu list">
      <li class="menu-item" @click="selectIssueType('story')">
        <IssueType type="story" />
      </li>
      <li class="menu-item" @click="selectIssueType('component')">
        <IssueType type="component" />
      </li>
      <li class="menu-item" @click="selectIssueType('task')">
        <IssueType type="task" />
      </li>
      <li class="menu-item" @click="selectIssueType('refactor')">
        <IssueType type="refactor" />
      </li>
      <li class="menu-item" @click="selectIssueType('bug')">
        <IssueType type="bug" />
      </li>
      <li class="menu-item" @click="selectIssueType('refinement')">
        <IssueType type="refinement" />
      </li>
      <li class="menu-item" @click="selectIssueType('quickfix')">
        <IssueType type="quickfix" />
      </li>
    </ul>
  </div>
</template>
