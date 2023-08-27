import type { RouteRecordRaw } from "vue-router";
import { beforeEnter } from "@/lib/router/before-enter";

const calendarRoutes: RouteRecordRaw[] = [
  {
    path: "/products/:id/calendar",
    name: "calendar",
    component: () => import("./CalendarView.vue"),
    beforeEnter,
  },
];

export default calendarRoutes;
