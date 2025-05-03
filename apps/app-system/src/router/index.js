import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/list",
      name: "list",
      component: () => import("@/views/list.vue"),
    },
    {
      path: "/generator",
      name: "generator",
      component: () => import("@/views/generator.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("@Pcomponents/page/default/404.vue"),
    },
  ],
});

export default router;
