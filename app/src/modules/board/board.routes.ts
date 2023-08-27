import type { RouteRecordRaw } from "vue-router";
import { beforeEnter } from "@/lib/router/before-enter";

const boardRoutes: RouteRecordRaw[] = [
  {
    path: "/products/:id/board",
    name: "board",
    component: () => import("./BoardView.vue"),
    beforeEnter,
  },
];

export default boardRoutes;
