<script lang="ts" setup>
import WkComboBox from '@/lib/components/form/WkComboBox.vue';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { createUsersRepository } from '@/lib/service/users.service';
import { createProductsRepository } from '@/lib/service/products.service';
import type { Collaborator } from '../products/product.model';
import type { User } from '@/lib/models/user.model';

const route = useRoute();

const selectedUser = ref<User>();
const userName = ref('');

const collaborators = ref<Collaborator[]>([]);

const productRepo = createProductsRepository();
const usersRepo = createUsersRepository();

onMounted(async () => {
  collaborators.value = await productRepo.fetchCollaborators(+route.params.id);
});

watch(selectedUser, () => {
  userName.value = selectedUser.value?.name ?? userName.value;
});

function searchUsers(name: string) {
  return usersRepo.searchUsers(name);
}

function includeCollaborator() {
  if (!selectedUser.value) return;
  productRepo.includeCollaborator(+route.params.id, selectedUser.value.id);
}

function removeCollaborator(collabId: number) {
  productRepo.removeCollaborator(+route.params.id, collabId);
}
</script>

<template>
  <div class="collaborators-view">
    <div>
      <b class="page-title">Collaborators</b>
      <ul class="collaborators-list list">
        <li v-for="collab in collaborators" :key="collab.id">
          <div class="collaborator-name">{{ collab.user.name }}</div>
          <div>
            <el-icon @click="removeCollaborator(collab.id)"><Delete /></el-icon>
          </div>
        </li>
      </ul>
      <form class="form-group" @submit.prevent="includeCollaborator">
        <WkComboBox
          v-model:text="userName"
          v-model:value="selectedUser"
          :search="searchUsers"
          :trackby="'id'"
          :labelBy="'name'"
          placeholder="Search for collaborators..."
        />
        <button type="submit">Include</button>
      </form>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.collaborators-view
  display: flex
  justify-content: center
  align-items: center
  min-height: calc(100vh - 200px)

.page-title
  display: block
  font-size: 1.5rem
  margin-bottom: 20px

.collaborators-list
  margin-bottom: 10px
  li
    display: flex
    gap: 30px

.collaborator-name
  flex: 1
</style>
