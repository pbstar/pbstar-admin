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
      path: "/generator",
      name: "generator",
      component: () => import("@/views/generator.vue"),
    },
    {
      path: "/enum",
      name: "enum",
      component: () => import("@/views/enum.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("@Pcomponents/page/default/404.vue"),
    },
  ],
});

export default router;
