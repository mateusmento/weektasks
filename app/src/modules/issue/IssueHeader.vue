<script lang="ts" setup>
import type { Issue } from '@/lib/models/issue.model';
import { envs } from '@/lib/utils/envs';

defineProps<{
  issue: Issue;
}>();
</script>

<template>
  <div class="issue-header">
    <div class="issue-title">{{ issue.title }}</div>
    <div class="issue-assigned-to">
      <img
        v-for="assignee of issue.assignees"
        :key="assignee.id"
        class="user-photo"
        :src="`${envs.API_BASE_URL}/users/${assignee.id}/photo`"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.issue-title {
  font-weight: 400;
  font-size: 24px;
  margin-bottom: 20px;
}

.issue-assigned-to {
  flex: 1;
}

.user-photo {
  width: 40px;
  margin-right: -15px;
}
</style>
