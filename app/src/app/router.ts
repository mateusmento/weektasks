import { beforeEnter } from '@/lib/router/before-enter';
import authRoutes from '@/modules/auth/auth.routes';
import backlogRoutes from '@/modules/backlog/backlog.routes';
import boardRoutes from '@/modules/board/board.routes';
import calendarRoutes from '@/modules/calendar/calendar.routes';
import collaboratorsRoutes from '@/modules/collaborators/collaborators.routes';
import issueRoutes from '@/modules/issue/issue.routes';
import timelineRoutes from '@/modules/timeline/timeline.routes';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      component: () => import('./layouts/AuthLayout.vue'),
      children: authRoutes,
    },
    {
      path: '/',
      alias: '/products',
      name: 'products',
      component: () => import('@/modules/products/ProductsView.vue'),
      beforeEnter,
    },
    {
      path: '/products/:id',
      component: () => import('./layouts/AppLayout.vue'),
      children: [
        ...timelineRoutes,
        ...backlogRoutes,
        ...collaboratorsRoutes,
        ...boardRoutes,
        ...issueRoutes,
        ...calendarRoutes,
      ],
    },
  ],
});

export default router;
