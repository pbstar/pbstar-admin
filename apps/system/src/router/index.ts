import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/permission",
      name: "permission",
      component: () => import("@/views/permission/index.vue"),
    },
    {
      path: "/user",
      name: "user",
      component: () => import("@/views/user/index.vue"),
    },
    {
      path: "/role",
      name: "role",
      component: () => import("@/views/role/index.vue"),
    },
    {
      path: "/log",
      name: "log",
      component: () => import("@/views/log/index.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("@Pcomponents/page/error.vue"),
    },
  ],
});

export default router;
