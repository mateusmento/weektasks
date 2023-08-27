const authRoutes = [
  {
    path: "/auth/signup",
    name: "signup",
    component: () => import("./signup/SignUpView.vue"),
  },
  {
    path: "/auth/signin",
    name: "signin",
    component: () => import("./signin/SignInView.vue"),
  },
];

export default authRoutes;
