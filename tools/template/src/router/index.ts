import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "index",
      redirect: "/list",
    },
    {
      path: "/list",
      name: "list",
      component: () => import("@/views/list/index.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("@Pcomponents/page/error.vue"),
    },
  ],
});

export default router;
