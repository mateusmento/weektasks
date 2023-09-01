<script lang="ts" setup>
import BacklogHeader from './components/BacklogHeader.vue';
import Sprints from './Sprints.vue';
import { useActiveProductStore } from '@/lib/stores/active-product.store';
import BacklogItems from './BacklogItems.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const productId = computed(() => +route.params.id);

const activeProductStore = useActiveProductStore();
</script>

<template>
  <main class="backlog-view">
    <section class="sprints-section">
      <h1>Sprints</h1>
      <Sprints :product-id="productId" />
    </section>
    <section class="product-backlog">
      <BacklogHeader
        v-if="activeProductStore.product"
        :active-product="activeProductStore.product"
      />
      <div class="product-backlog-label">Product Backlog</div>
      <BacklogItems :product-id="productId" />
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
