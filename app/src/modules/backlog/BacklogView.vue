<script lang="ts" setup>
import SprintsSection from './sprint/SprintsSection.vue';
import BacklogItems from './backlog/BacklogItems.vue';
import BacklogHeader from './backlog/BacklogHeader.vue';
</script>

<template>
  <main class="backlog-view">
    <section class="sprints-section">
      <h1>Sprints</h1>
      <SprintsSection />
    </section>
    <section class="product-backlog">
      <BacklogHeader />
      <div class="product-backlog-label">Product Backlog</div>
      <BacklogItems />
    </section>
  </main>
</template>

<style scoped>
.backlog-view {
  display: flex;
  margin: auto;
  gap: 60px;
  flex: 1;
}

.sprints-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 650px;
  padding-top: 60px;
}

.product-backlog {
  width: 700px;
  min-height: 100%;
  padding: 60px;
  background-color: white;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25);
}

.product-backlog-label {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}
</style>
