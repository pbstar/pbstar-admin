import { createRouter, createWebHistory } from "vue-router";
import NotFound from "@/views/404/index.vue";
import NotAuth from "@/views/403/index.vue";
import Layout from "@/layout/index.vue";
import useUserStore from "@/stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/:pathMatch(.*)", component: NotFound },
    { path: "/403", component: NotAuth },
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
            isAuth: true,
          },
          component: () => import("@/views/admin/home/index.vue"),
        },
        {
          path: "user",
          name: "adminUser",
          meta: {
            title: "用户管理",
            isAuth: true,
          },
          component: () => import("@/views/admin/user/index.vue"),
        },
        {
          path: "role",
          name: "adminRole",
          meta: {
            title: "角色管理",
            isAuth: true,
          },
          component: () => import("@/views/admin/role/index.vue"),
        },
        {
          path: "menu",
          name: "adminMenu",
          meta: {
            title: "菜单管理",
            isAuth: true,
          },
          component: () => import("@/views/admin/menu/index.vue"),
        },
        {
          path: "app_template",
          name: "adminAppTemplate",
          meta: {
            title: "模板管理",
            isAuth: true,
            isApp: true,
            appName: "template",
          },
          component: () => import("@/views/apps/template.vue"),
        },
        {
          path: "link_juejin",
          name: "adminLinkJuejin",
          meta: {
            title: "掘金",
            isAuth: true,
          },
          component: () => import("@/views/links/juejin.vue"),
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
router.beforeEach((to, from, next) => {
  if (to.fullPath == from.fullPath) return;
  if (!to.meta.isApp && from.meta.isApp) {
    // 过滤从app跳过来自动触发的
    let bool = false;
    for (let key in to.query) {
      if (from.query[key]) {
        bool = true;
        break;
      }
    }
    if (bool) return;
  }
  authRouter(to, from, next);
});

// 路由鉴权
const authRouter = (to, from, next) => {
  if (!to.meta.isAuth) return next();
  const user = useUserStore();
  if (!user.isLogin) return next("/login");
  user.getMyMenuList().then((res) => {
    let menuList = res || [];
    let id = menuList.find((item) => item.path === to.fullPath)?.id;
    if (id) next();
    else next("/403");
  });
};

export default router;
