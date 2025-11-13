import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/nav",
      name: "nav",
      component: () => import("@/views/nav.vue"),
    },
    {
      path: "/enum",
      name: "enum",
      component: () => import("@/views/enum.vue"),
    },
    {
      path: "/user",
      name: "user",
      component: () => import("@/views/user.vue"),
    },
    {
      path: "/role",
      name: "role",
      component: () => import("@/views/role.vue"),
    },
    {
      path: "/log",
      name: "log",
      component: () => import("@/views/log.vue"),
    },
    {
      path: "/app",
      name: "app",
      component: () => import("@/views/app.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("@Pcomponents/page/404.vue"),
    },
  ],
});

export default router;
