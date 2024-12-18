import { createRouter, createWebHistory } from "vue-router";
import NotFound from "@/views/404/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      redirect: "/page1",
    },
    {
      path: "/page1",
      name: "page1",
      component: () => import("@/views/page1.vue"),
    },
    {
      path: "/page2",
      name: "page2",
      component: () => import("@/views/page2.vue"),
    },
    {
      path: "/error",
      name: "error",
      component: () => import("@/views/error.vue"),
    },
    { path: "/:pathMatch(.*)", component: NotFound },
  ],
});

export default router;
