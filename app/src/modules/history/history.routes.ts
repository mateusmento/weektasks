import { beforeEnter } from "@/lib/router/before-enter";
import type { RouteRecordRaw } from "vue-router";

const historyRoutes: RouteRecordRaw[] = [
  {
    path: "/products/:id/history",
    name: "history",
    props: true,
    component: () => import("./HistoryView.vue"),
    beforeEnter,
  },
];

export default historyRoutes;
