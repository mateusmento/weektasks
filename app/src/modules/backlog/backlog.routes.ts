import { beforeEnter } from '@/lib/router/before-enter';
import type { RouteRecordRaw } from 'vue-router';

const backlogRoutes: RouteRecordRaw[] = [
  {
    path: '/products/:id/backlog',
    name: 'backlog',
    component: () => import('./BacklogView.vue'),
    beforeEnter,
  },
];

export default backlogRoutes;
