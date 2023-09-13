<script lang="ts" setup>
import { UserApi } from '@/lib/api/users.api';
import WkComboBox from '@/lib/components/form/WkComboBox.vue';
import { vOnClickOutside } from '@vueuse/components';
import IconAssignUser from '@/lib/components/icons/IconAssignUser.vue';
import { ref, watch } from 'vue';
import type { User } from '../models/user.model';
import type { Issue } from '../models/issue.model';
import IconTrash from './icons/IconTrash.vue';
import { envs } from '../utils/envs';

defineProps<{
  issue: Issue;
}>();

const emit = defineEmits<{
  (e: 'assign', user: User): void;
  (e: 'remove', user: User): void;
}>();

const userApi = new UserApi();

const showUsers = ref(false);

const userName = ref('');
const selectedUser = ref<User>();

watch(selectedUser, () => {
  userName.value = selectedUser.value?.name ?? userName.value;
});

async function toggleUserAssigning() {
  showUsers.value = !showUsers.value;
}

function searchUsers(name: string) {
  return userApi.searchUsers(name);
}

async function assign() {
  if (!selectedUser.value) return;
  showUsers.value = false;
  emit('assign', selectedUser.value);
}

async function remove(assignee: User) {
  emit('remove', assignee);
}
</script>

<template>
  <span class="assign-user-to" v-on-click-outside="() => (showUsers = false)">
    <span @click="toggleUserAssigning" title="Assign a collaborator">
      <IconAssignUser class="hover-hidden" />
    </span>

    <form
      @submit.prevent="assign"
      class="flex-vert gap-lg users"
      :class="{ active: showUsers }"
      @click.stop=""
    >
      <div class="assign-user-to-title">
        <b>Assign a collaborator</b>
      </div>
      <div>
        <WkComboBox
          class="small"
          v-model:value="selectedUser"
          v-model:text="userName"
          trackby="id"
          label-by="name"
          :search="searchUsers"
        />
        <button class="small" type="submit">Assign</button>
      </div>
      <div class="flex-vert gap-sm">
        <div
          v-for="assignee of issue.assignees"
          :key="assignee.id"
          class="flex-horz gap-md y-center"
        >
          <img class="assignee-photo" :src="`${envs.API_BASE_URL}/users/${assignee.id}/photo`" />
          {{ assignee.name }}
          <IconTrash class="ml-auto" @click="remove(assignee)" />
        </div>
      </div>
    </form>
  </span>
</template>

<style lang="scss" scoped>
.assign-user-to {
  position: relative;
}

.assign-user-to-title {
  margin-bottom: 10px;
  margin-left: 5px;
}

.assign-user-to .users {
  display: none;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: absolute;
  background-color: white;
  top: 20px;
  right: -20px;
  z-index: 1;
  min-width: 240px;

  button {
    display: block;
    margin-left: auto;
    margin-top: 10px;
  }
}

.assign-user-to .users.active {
  display: flex;
}

.assignee-photo {
  height: 26px;
}
</style>
