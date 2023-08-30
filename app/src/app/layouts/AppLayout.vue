<script setup lang="ts">
import ColorfulBar from '@/lib/components/layout/ColorfulBar.vue';
import TopbarHeader from '@/lib/components/layout/TopbarHeader.vue';
import { useIssueModalStore } from '@/lib/stores/issue-modal.store';
import Issue from '@/modules/issue/Issue.vue';
import { vOnClickOutside } from '@vueuse/components';
import { RouterView } from 'vue-router';

const issueModalStore = useIssueModalStore();
</script>

<template>
  <TopbarHeader />
  <RouterView></RouterView>

  <aside class="drawer" :class="{ 'drawer--show': issueModalStore.isOpen }">
    <div class="issue-view">
      <ColorfulBar thick />
      <Issue
        v-if="issueModalStore.issue !== null"
        v-model:issue="issueModalStore.issue"
        v-on-click-outside="() => issueModalStore.close()"
      />
    </div>
  </aside>

  <!-- <teleport to="#modal">
    <div class="backscreen" v-if="issueModalStore.isOpen">
      <div class="modal" v-on-click-outside="() => issueModalStore.close()">
        <IssueView v-if="issueModalStore.issue" :issue-id="issueModalStore.issue.id"/>
      </div>
    </div>
  </teleport> -->
</template>

<style lang="scss" scoped>
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

.product-content
  padding: 60px 80px
  flex: 1
  background: #F6FAFF

.backscreen
  background-color: rgb(0, 0, 0, .2)
  position: fixed
  top: 0
  width: 100vw
  height: 100vh
  z-index: 10
  overflow: auto
  padding: 20px

.modal
  background-color: white
  width: fit-content
  margin: auto
  min-height: calc(100vh - 40px)
  padding: 20px
</style>
