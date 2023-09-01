<script lang="ts" setup>
import type { Issue as IIssue } from '@/lib/models/issue.model';
import { createIssuesRepository } from '@/lib/service/issues.service';
import { onMounted, ref } from 'vue';
import Issue from './Issue.vue';

const props = defineProps<{
  issueId: string;
}>();

const issueRepo = createIssuesRepository();

const issue = ref<IIssue>();

onMounted(async () => {
  issue.value = await fetchIssue(+props.issueId);
});

async function fetchIssue(issueId: number): Promise<IIssue> {
  const [issue, comments] = await Promise.all([
    await issueRepo.fetchIssue(issueId),
    await issueRepo.findComments(issueId),
  ]);
  return { ...issue, comments };
}
</script>

<template>
  <div class="issue-view" v-if="issue">
    <Issue v-model:issue="issue" />
  </div>
</template>

<style lang="scss" scoped>
.issue-view {
  width: 720px;
  margin: 0 auto;
  background-color: #f6faff;
  min-height: 100%;
}
</style>
