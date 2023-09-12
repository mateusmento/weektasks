<script setup lang="ts">
import ColorfulBar from '@/lib/components/layout/ColorfulBar.vue';
import TopbarHeader from '@/lib/components/layout/TopbarHeader.vue';
import { useIssueModalStore } from '@/lib/stores/issue-modal.store';
import Issue from '@/modules/issue/Issue.vue';
import { vOnClickOutside } from '@vueuse/components';
import { RouterView } from 'vue-router';

const issueModalStore = useIssueModalStore();

function closeIssue() {
  if (!issueModalStore.isOpen) issueModalStore.issue = null;
}
</script>

<template>
  <div class="app-layout">
    <header>
      <TopbarHeader />
    </header>

    <main>
      <aside class="aside-menu"></aside>
      <RouterView />
    </main>

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
  display: flex;
  flex-direction: column;
  height: 100%;
}

header {
  position: sticky;
  top: 0;
  z-index: 1;

  height: 71px;
  box-sizing: border-box;
}

main {
  display: flex;
  height: calc(100% - 71px);
}

.aside-menu {
  width: 300px;
  background-color: #242424;
}

.issue-view {
  width: 720px;
  margin: 0 auto;
  background-color: #f6faff;
  min-height: 100%;
}
</style>

<style lang="sass" scoped>
.drawer
  position: fixed
  overflow: auto
  inset: 70.4px 0 0 auto
  transform: translateX(100%)
  box-shadow: 0 0 5px rgba(0, 0, 0, .25)
  transition: 200ms
  z-index: 1

.drawer--show
  transform: translateX(0)
</style>
