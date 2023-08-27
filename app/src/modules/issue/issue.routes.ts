import type { RouteRecordRaw } from 'vue-router';
import { beforeEnter } from '@/lib/router/before-enter';

const issueRoutes: RouteRecordRaw[] = [
  {
    path: '/products/:id/issues/:issueId',
    name: 'issue',
    component: () => import('./IssueView.vue'),
    beforeEnter,
    props: true,
  },
];

export default issueRoutes;
