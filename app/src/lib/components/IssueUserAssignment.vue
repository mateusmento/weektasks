<script lang="ts" setup>
import { createUsersRepository } from '@/lib/service/users.service';
import WkComboBox from '@/lib/components/form/WkComboBox.vue';
import { vOnClickOutside } from '@vueuse/components';
import IconAssignUser from '@/lib/components/icons/IconAssignUser.vue';
import { ref, watch } from 'vue';
import { createIssuesRepository } from '../service/issues.service';
import type { User } from '../models/user.model';
import type { Issue } from '../models/issue.model';
import IconTrash from './icons/IconTrash.vue';
import { envs } from '../utils/envs';

let props = defineProps<{
  issue: Issue;
}>();

let emit = defineEmits(['update:issue']);

const showUsers = ref(false);

const issuesRepo = createIssuesRepository();

const userName = ref('');
const selectedUser = ref<User>();

watch(selectedUser, () => {
  userName.value = selectedUser.value?.name ?? userName.value;
});

async function toggleUserAssigning() {
  showUsers.value = !showUsers.value;
}

const usersRepo = createUsersRepository();

function searchUsers(name: string) {
  return usersRepo.searchUsers(name);
}

async function assignUser() {
  if (!selectedUser.value) return;
  const issue = await issuesRepo.assignUser(props.issue.id, selectedUser.value.id);
  showUsers.value = false;
  emit('update:issue', issue);
}

async function removeAssignee(assigneeId: number) {
  const issue = await issuesRepo.removeAssignee(props.issue.id, assigneeId);
  emit('update:issue', issue);
}
</script>

<template>
  <span class="assign-user-to" v-on-click-outside="() => (showUsers = false)">
    <span @click="toggleUserAssigning" title="Assign a collaborator">
      <IconAssignUser class="hover-hidden" />
    </span>

    <form
      @submit.prevent="assignUser"
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
      <div class="flex-vert gap-md">
        <div v-for="assignee of issue.assignees" :key="assignee.id" class="flex-horz gap-md">
          <img class="assignee-photo" :src="`${envs.API_BASE_URL}/users/${assignee.id}/photo`" />
          {{ assignee.name }}
          <IconTrash @click="removeAssignee(assignee.id)" />
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

  .combo-box {
    max-width: 180px;
  }

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
  width: 17px;
}
</style>
