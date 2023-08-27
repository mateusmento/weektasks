import { beforeEnter } from '@/lib/router/before-enter';

const collaboratorsRoutes = [
  {
    path: '/products/:id/collaborators',
    name: 'collaborators',
    component: () => import('./CollaboratorsView.vue'),
    beforeEnter,
  },
];

export default collaboratorsRoutes;
