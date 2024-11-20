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
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/index.vue"),
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   console.log(to, from,"beforeEach");
  
//   const user = useUserStore();
//   user.getMenuList().then((res) => {
//     let menuList = res || [];
//     let id = menuList.find((item) => item.path === to.fullPath)?.id || "";
//     // if (!id && to.meta.isAuth) {
//     //   next("/403");
//     // } else {
//       next();
//     // }
//   });
// });

export default router;
