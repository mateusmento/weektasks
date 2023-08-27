<script lang="ts" setup>
import type { User } from '@/lib/models/user.model';
import { createIssuesRepository } from "@/lib/service/issues.service";
import { onMounted, ref } from 'vue';
import CreateDiscussion from '../timeline/CreateDiscussion.vue';

const props = defineProps<{
  issueId: number;
}>();

const issueRepo = createIssuesRepository();

interface IIssueComment {
  id: number;
  text: string;
  author: User;
}

const newCommentText = ref('');
const comments = ref<IIssueComment[]>([]);

onMounted(async () => {
  comments.value = await issueRepo.findComments(props.issueId);
});

async function addComment() {
  const comment = await issueRepo.addComment(props.issueId, newCommentText.value);
  comments.value.unshift(comment)
  newCommentText.value = '';
}

async function removeComment(id: number) {
  issueRepo.removeComment(id);
  comments.value = comments.value.filter(c => c.id !== id);
}

async function editComment(id: number, text: string) {
  await issueRepo.updateComment(id, { text });
}
</script>

<template>
  <div class="issue-comments flex-vert-lg">
    <div class="section-title"><b>Comments</b></div>
    <CreateDiscussion @created="addComment" />
    <IssueComment v-for="(comment, i) of comments" :key="comment.id" v-model:comment="comments[i]" @remove="removeComment"
      @edit="editComment" />
  </div>
</template>

<style lang="sass" scoped>
.section-title
  margin-bottom: 20px

form
  margin-bottom: 20px

.add-comment
  display: block
  margin-left: auto
  margin-top: 10px
</style>
