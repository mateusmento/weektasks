<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ProductApi } from '@/lib/api/products.api';
import type { Collaborator } from '../products/product.model';
import { envs } from '@/lib/utils/envs';

const route = useRoute();

const collaborators = ref<Collaborator[]>([]);

const productApi = new ProductApi();

onMounted(async () => {
  collaborators.value = await productApi.fetchCollaborators(+route.params.id);
});
</script>

<template>
  <div class="collaborators-view">
    <b class="page-title">Collaborators</b>
    <ul class="collaborators-list">
      <li v-for="collab in collaborators" :key="collab.id">
        <img class="user-photo" :src="`${envs.API_BASE_URL}/users/${collab.user.id}/photo`" />

        <div class="collaborator-name">{{ collab.user.name }}</div>
      </li>
    </ul>
  </div>
</template>

<style lang="sass" scoped>
.page-title
  display: block
  font-size: 1rem
  margin-bottom: 20px

.collaborators-list
  display: flex
  flex-direction: column
  gap: 10px
  margin-bottom: 10px

  li
    display: flex
    align-items: center
    gap: 10px

.collaborator-name
  flex: 1
</style>

<style scoped>
.user-photo {
  width: 30px;
}
</style>
