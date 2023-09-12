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
  <TopbarHeader />
  <RouterView />

  <!-- <div class="wrapper">
    <div class="section">
      <div class="item">Hello world</div>
      <div class="item">Hello world</div>
      <div class="item">Hello world</div>
      <div class="item">Hello world</div>
      <div class="item">Hello world</div>
      <div class="item">Hello world</div>
      <div class="item">Hello world</div>
    </div>

    <div class="section">
      <div class="item">Hello world</div>
      <div class="item">Hello world</div>
      <div class="item">Hello world</div>
      <div class="item">Hello world</div>
      <div class="item">Hello world</div>
      <div class="item">Hello world</div>
      <div class="item">Hello world</div>
    </div>
  </div> -->

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
</template>

<style lang="scss" scoped>
.wrapper {
  flex: 1;
  display: flex;
  overflow-y: hidden;
}

.section {
  flex: 1;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: 10px;
  background-color: red;
}

.item {
  min-height: 150px;
  background-color: #fff;
  border: 1px solid #777;
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
