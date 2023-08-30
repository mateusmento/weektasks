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
    <section class="product-backlog-section">
      <div class="product-backlog">
        <BacklogHeader />
        <div class="product-backlog-label">Product Backlog</div>
        <BacklogItems />
      </div>
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
  padding-top: 60px;
  min-width: 650px;
}

.product-backlog-section {
  position: relative;
  top: 0;
  bottom: 0;
}

.product-backlog {
  background-color: white;
  width: 700px;
  padding: 60px;
  position: relative;
  top: 0;
  bottom: 0;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25);
  height: 100%;
}

.product-backlog-label {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}
</style>
