<script lang="ts" setup>
import { envs } from '@/lib/utils/envs';
import type { Product } from '@/modules/products/product.model';

defineProps<{
  activeProduct: Product;
}>();
</script>

<template>
  <div class="topsection">
    <div>
      <div class="subtitle">Product</div>
      <div class="title">{{ activeProduct.name }}</div>
    </div>

    <div class="product-collaborators">
      <div class="subtitle">Collaborators</div>
      <div class="user-photos">
        <img
          v-for="collaborator of activeProduct.collaborators"
          :key="collaborator.id"
          class="user-photo"
          :src="`${envs.API_BASE_URL}/users/${collaborator.user.id}/photo`"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
