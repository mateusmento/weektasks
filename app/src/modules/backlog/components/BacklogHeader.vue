<script lang="ts" setup>
import { envs } from '@/lib/utils/envs';
import type { Product } from '@/modules/products/product.model';
import CollaboratorsView from '@/modules/collaborators/CollaboratorsView.vue';
import { ref } from 'vue';

defineProps<{
  activeProduct: Product;
}>();

const open = ref(false);
</script>

<template>
  <div class="backlog-header">
    <div>
      <div class="subtitle">Product</div>
      <div class="title">{{ activeProduct.name }}</div>
    </div>

    <div class="product-collaborators">
      <div class="subtitle">Collaborators</div>
      <div class="user-photos" @click="open = true">
        <img
          v-for="collaborator of activeProduct.collaborators"
          :key="collaborator.id"
          class="user-photo"
          :src="`${envs.API_BASE_URL}/users/${collaborator.user.id}/photo`"
        />
      </div>
    </div>

    <el-dialog class="collaborators-dialog" v-model="open" :show-close="false">
      <CollaboratorsView />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.backlog-header:deep() .collaborators-dialog {
  border-radius: 10px;
  width: fit-content;
}

.backlog-header {
  display: flex;
  justify-content: space-between;
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

.user-photos {
  display: flex;
  flex-direction: row-reverse;
  width: fit-content;
  cursor: pointer;
}

.user-photos:hover .user-photo {
  box-shadow: 0 0 0px 3px #8438b1b4;
}

.user-photo {
  width: 40px;
  margin-right: -15px;
  border-radius: 100px;
  transition: 200ms;
}
</style>
