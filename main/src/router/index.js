import { createRouter, createWebHistory } from "vue-router";
import NotFound from "@/views/404/index.vue";
import Layout from "@/layout/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/:pathMatch(.*)", component: NotFound },
    {
      path: "/",
      name: "home",
      redirect: "/admin/home",
    },
    {
      path: "/admin",
      name: "admin",
      redirect: "/admin/home",
      component: Layout,
      children: [
        {
          path: "home",
          name: "adminHome",
          meta: {
            title: "首页",
          },
          component: () => import("@/views/admin/home/index.vue"),
        },
        {
          path: "user",
          name: "adminUser",
          meta: {
            title: "用户管理",
          },
          component: () => import("@/views/admin/user/index.vue"),
        },
        {
          path: "app_template",
          name: "adminAppTemplate",
          meta: {
            title: "模板管理",
          },
          component: () => import("@/views/apps/template.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/index.vue"),
    },
  ],
});

export default router;
