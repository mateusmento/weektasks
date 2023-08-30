<script lang="ts" setup>
import { envs } from '@/lib/utils/envs';
import BacklogItems from './BacklogItems.vue';
import { useActiveProductStore } from '@/lib/stores/active-product.store';

const activeProductStore = useActiveProductStore();
</script>

<template>
  <div class="product-backlog">
    <div class="topsection">
      <div>
        <div class="subtitle">Product</div>
        <div class="title">{{ activeProductStore.product?.name }}</div>
      </div>

      <div class="product-collaborators">
        <div class="subtitle">Collaborators</div>
        <div class="user-photos">
          <img
            v-for="collaborator of activeProductStore.product?.collaborators"
            :key="collaborator.id"
            class="user-photo"
            :src="`${envs.API_BASE_URL}/users/${collaborator.user.id}/photo`"
          />
        </div>
      </div>
    </div>

    <div class="product-backlog-label">Product Backlog</div>

    <BacklogItems />
  </div>
</template>

<style lang="scss" scoped>
.product-backlog {
  background-color: white;
  width: 700px;
  padding: 60px;
  position: relative;
  top: 0;
  bottom: 0;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25);
}

.topsection {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.subtitle {
  font-size: 20px;
  color: #777;
}

.title {
  font-size: 32px;
  color: #474747;
}

.product-backlog-label {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

.product-collaborators {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-photo {
  width: 40px;
  margin-right: -15px;
}
</style>
@/lib/stores/active0product.store
