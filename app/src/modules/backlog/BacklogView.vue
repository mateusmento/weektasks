<script lang="ts" setup>
import SprintsSection from './sprint/SprintsSection.vue';
import BacklogSection from './backlog/BacklogSection.vue';
</script>

<template>
  <main class="backlog-view">
    <section class="sprints-section">
      <h1>Sprints</h1>
      <SprintsSection />
    </section>
    <section class="product-backlog-section">
      <BacklogSection />
    </section>
  </main>
</template>

<style scoped>
.backlog-view {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex: 1;
}

.sprints-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 60px;
  min-width: 650px;
}

.product-backlog-section {
  position: relative;
  top: 0;
  bottom: 0;
}
.product-backlog {
  height: 100%;
}
</style>
