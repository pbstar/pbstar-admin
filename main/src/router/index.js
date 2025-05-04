import { createRouter, createWebHistory } from "vue-router";
import apps from "../../../apps/apps.json";
const isDev = import.meta.env.DEV;
const appsRouter = apps.map((item) => {
  return {
    path: item.name,
    name: "admin_" + item.name,
    component: () => import(`@/views/admin/app.vue`),
    meta: {
      appName: item.name,
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
      redirect: "/admin/home",
      children: [
        {
          path: "home",
          name: "admin_home",
          component: () => import("@/views/admin/home.vue"),
        },
        ...appsRouter,
        {
          path: ":pathMatch(.*)*",
          name: "admin_notFound",
          component: () => import("@Pcomponents/page/default/404.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("@Pcomponents/page/default/404.vue"),
    },
  ],
});

router.afterEach((to) => {});
export default router;
