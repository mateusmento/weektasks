<script lang="ts" setup>
import WkComboBox from '@/lib/components/form/WkComboBox.vue';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { UserApi } from '@/lib/api/users.api';
import { ProductApi } from '@/lib/api/products.api';
import type { Collaborator } from '../products/product.model';
import type { User } from '@/lib/models/user.model';
import { envs } from '@/lib/utils/envs';

const route = useRoute();

const selectedUser = ref<User>();
const userName = ref('');

const collaborators = ref<Collaborator[]>([]);

const productApi = new ProductApi();
const userApi = new UserApi();

onMounted(async () => {
  collaborators.value = await productApi.fetchCollaborators(+route.params.id);
});

watch(selectedUser, () => {
  userName.value = selectedUser.value?.name ?? userName.value;
});

function searchUsers(name: string) {
  return userApi.searchUsers(name);
}

async function includeCollaborator() {
  if (!selectedUser.value) return;
  const collaborator = await productApi.includeCollaborator(
    +route.params.id,
    selectedUser.value.id
  );
  collaborators.value.push(collaborator);
}

async function removeCollaborator(collabId: number) {
  await productApi.removeCollaborator(+route.params.id, collabId);
  collaborators.value = collaborators.value.filter((c) => c.id !== collabId);
}
</script>

<template>
  <div class="collaborators-view">
    <div>
      <b class="page-title">Collaborators</b>
      <ul class="collaborators-list list">
        <li v-for="collab in collaborators" :key="collab.id">
          <img class="user-photo" :src="`${envs.API_BASE_URL}/users/${collab.user.id}/photo`" />

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
  // min-height: calc(100vh - 200px)

.page-title
  display: block
  font-size: 1.5rem
  margin-bottom: 20px

.collaborators-list
  margin-bottom: 10px
  li
    display: flex
    align-items: center
    gap: 30px

.collaborator-name
  flex: 1
</style>

<style scoped>
.user-photo {
  width: 30px;
}
</style>
