import { createRouter, createWebHistory } from "vue-router";
import apps from "../../../apps/apps.json" with { type: "json" };

// 判断是否为开发环境
const isDev = import.meta.env.DEV;

// 动态生成子应用路由配置
const appsRouter = apps.map((item) => {
  return {
    path: item.key,
    name: "admin_" + item.key,
    component: () => import(`@/views/admin/app.vue`),
    meta: {
      appKey: item.key,
      appUrl: isDev ? `http://localhost:${item.devPort}/` : item.proUrl,
    },
  };
});

const router = createRouter({
  history: createWebHistory(),
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
      redirect: "/admin/pHome",
      children: [
        {
          path: "pHome",
          name: "admin_pHome",
          component: () => import("@/views/admin/home.vue"),
        },
        {
          path: "pUser",
          name: "admin_pUser",
          component: () => import("@/views/admin/user.vue"),
        },
        ...appsRouter,
      ],
    },
    {
      path: "/403",
      name: "403",
      component: () => import("@Pcomponents/page/403.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("@Pcomponents/page/404.vue"),
    },
  ],
});

export default router;
