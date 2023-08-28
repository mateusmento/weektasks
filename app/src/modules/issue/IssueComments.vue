<script lang="ts" setup>
import type { User } from '@/lib/models/user.model';
import { createIssuesRepository } from '@/lib/service/issues.service';
import { onMounted, ref } from 'vue';
import CreateIssueComment from './CreateIssueComment.vue';
import IssueComment from './IssueComment.vue';

const props = defineProps<{
  issueId: number;
}>();

const issueRepo = createIssuesRepository();

interface IIssueComment {
  id: number;
  text: string;
  author: User;
}

const comments = ref<IIssueComment[]>([]);

onMounted(async () => {
  comments.value = await issueRepo.findComments(props.issueId);
});

async function addComment({ text }: any) {
  const comment = await issueRepo.addComment(props.issueId, { text });
  comments.value.unshift(comment);
}

async function removeComment(id: number) {
  issueRepo.removeComment(id);
  comments.value = comments.value.filter((c) => c.id !== id);
}

async function editComment(id: number, text: string) {
  await issueRepo.updateComment(id, { text });
}
</script>

<template>
  <div class="issue-comments flex-vert-lg">
    <div class="section-title">Comments</div>
    <CreateIssueComment @created="addComment" />
    <IssueComment
      v-for="(comment, i) of comments"
      :key="comment.id"
      v-model:comment="comments[i]"
      @remove="removeComment"
      @edit="editComment"
    />
  </div>
</template>

<style lang="sass" scoped>
.section-title
  margin-bottom: 20px
  font-weight: 600

form
  margin-bottom: 20px

.add-comment
  display: block
  margin-left: auto
  margin-top: 10px
</style>
