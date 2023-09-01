const authRoutes = [
  {
    path: '/auth/signup',
    name: 'signup',
    component: () => import('./SignUpView.vue'),
  },
  {
    path: '/auth/signin',
    name: 'signin',
    component: () => import('./SignInView.vue'),
  },
];

export default authRoutes;
