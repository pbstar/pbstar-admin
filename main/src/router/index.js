import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      redirect: "/admin",
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/index.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("@/views/admin/index.vue"),
      redirect: "/admin/home",
      children: [
        {
          path: "home",
          name: "admin_home",
          component: () => import("@/views/admin/home.vue"),
        },
        {
          path: "apps",
          name: "admin_apps",
          component: () => import("@/views/admin/apps.vue"),
        },
        {
          path: ":pathMatch(.*)*",
          name: "admin_notFound",
          component: () => import("@/views/default/404.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("@/views/default/404.vue"),
    },
  ],
});

router.afterEach((to) => {});
export default router;
