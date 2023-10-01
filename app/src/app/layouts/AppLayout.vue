<script setup lang="ts">
import ColorfulBar from '@/lib/components/layout/ColorfulBar.vue';
import Topbar from '@/lib/components/layout/Topbar.vue';
import { useIssueModalStore } from '@/lib/stores/issue-modal.store';
import Issue from '@/modules/issue/Issue.vue';
import Collaborators from '@/modules/timeline/Collaborators.vue';
import { vOnClickOutside } from '@vueuse/components';
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';

const issueModalStore = useIssueModalStore();

const route = useRoute();
const id = computed(() => route.params.id);

function closeIssue() {
  if (!issueModalStore.isOpen) issueModalStore.issue = null;
}
</script>

<template>
  <div class="app-layout">
    <Topbar class="app-header" />

    <div class="app-main">
      <aside class="flex-vert-lg p-md">
        <nav>
          <ul class="list flex-vert-md">
            <li>
              <router-link :to="{ name: 'timeline', params: { id } }">Timeline</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'backlog', params: { id } }">Backlog</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'board', params: { id } }">Board</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'calendar', params: { id } }">Calendar</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'collaborators', params: { id } }"
                >Collaborators</router-link
              >
            </li>
          </ul>
        </nav>

        <Collaborators />
      </aside>

      <RouterView />
    </div>

    <aside
      class="drawer"
      :class="{ 'drawer--show': issueModalStore.isOpen }"
      @transitionend="closeIssue"
    >
      <div class="issue-view">
        <ColorfulBar thick />
        <Issue
          v-if="issueModalStore.issue !== null"
          v-model:issue="issueModalStore.issue"
          v-on-click-outside="() => issueModalStore.close()"
        />
      </div>
    </aside>
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  --header-height: 71px;

  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 1;

  box-sizing: border-box;
  height: var(--header-height);
}

.app-main {
  display: flex;
  gap: 10px;
  padding: 10px;
  height: calc(100% - var(--header-height));
  padding-inline: 10px;
}

.issue-view {
  width: 720px;
  margin: 0 auto;
  background-color: #f6faff;
  min-height: 100%;
}
</style>

<style scoped>
.drawer {
  position: fixed;
  overflow: auto;
  inset: 70.4px 0 0 auto;
  transform: translateX(100%);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  transition: 200ms;
  z-index: 1;
}

.drawer--show {
  transform: translateX(0);
}
</style>
