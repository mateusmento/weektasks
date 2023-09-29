<script lang="ts" setup>
import { useActiveProductStore } from '@/lib/stores/active-product.store';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import BacklogItems from './BacklogItems.vue';
import Sprints from './Sprints.vue';
import BacklogHeader from './components/BacklogHeader.vue';

const route = useRoute();
const productId = computed(() => +route.params.id);

const activeProductStore = useActiveProductStore();
</script>

<template>
  <main class="backlog-view">
    <section class="sprints-section">
      <BacklogHeader
        v-if="activeProductStore.product"
        :active-product="activeProductStore.product"
      />

      <div class="flex-horz x-justify">
        <h1>Sprints</h1>
      </div>

      <div class="sprints-dragzone">
        <Sprints :product-id="productId" />
      </div>
    </section>

    <section class="product-backlog">
      <h2 class="product-backlog-label">Backlog</h2>
      <BacklogItems :product-id="productId" />
    </section>
  </main>
</template>

<style scoped>
.backlog-view {
  display: flex;
  gap: 10px;
  /* margin: 40px; */
  margin-top: 0;
  flex: 1;
}

.sprints-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 20px;
  /* min-width: 650px; */
  padding-top: 60px;
  background-color: white;
  padding: 60px;
  border-radius: 40px;
  /* margin-block: 40px; */
}

.sprints-dragzone {
  background-color: #e8f2fd;
  padding: 10px;
  border-radius: 20px;
}

.product-backlog {
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* flex: 1; */
  /* width: 500px; */
  padding: 40px;
  /* margin-block: 40px; */
  border-radius: 40px;

  background-color: white;
}

.product-backlog-label {
  font-size: 32px;
  font-weight: 600;
}
</style>
