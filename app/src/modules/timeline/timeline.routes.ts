import { beforeEnter } from '@/lib/router/before-enter';

const timelineRoutes = [
  {
    path: '/products/:id/timeline',
    name: 'timeline',
    props: true,
    component: () => import('./TimelineView.vue'),
    beforeEnter,
  },
];

export default timelineRoutes;
