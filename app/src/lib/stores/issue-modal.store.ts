import type { Issue } from '@/lib/models/issue.model';
import { defineStore } from 'pinia';

export const useIssueModalStore = defineStore('issue-modal', {
  state: () => ({
    issue: null as Issue | null,
    isOpen: false,
  }),
  actions: {
    open(issue: Issue) {
      this.isOpen = true;
      this.issue = issue;
    },
    close() {
      this.isOpen = false;
      // this.issue = null;
    },
  },
});
