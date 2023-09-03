import type { Issue } from '@/lib/models/issue.model';
import { defineStore } from 'pinia';
import { createIssuesRepository } from '../service/issues.service';

export const useIssueModalStore = defineStore('issue-modal', {
  state: () => ({
    issue: null as Issue | null,
    isOpen: false,
  }),
  actions: {
    async open(issue: Issue) {
      const issueRepo = createIssuesRepository();
      const comments = await issueRepo.findComments(issue.id);
      this.issue = null;
      setTimeout(() => {
        this.isOpen = true;
        this.issue = { ...issue, comments };
      });
    },
    close() {
      this.isOpen = false;
      // this.issue = null;
    },
  },
});
