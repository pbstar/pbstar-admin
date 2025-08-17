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
      path: "/echarts",
      name: "echarts",
      component: () => import("@/views/echarts.vue"),
    },
    {
      path: "/editorMd",
      name: "editorMd",
      component: () => import("@/views/editorMd.vue"),
    },
    {
      path: "/editorRt",
      name: "editorRt",
      component: () => import("@/views/editorRt.vue"),
    },
    {
      path: "/bigScreen",
      name: "bigScreen",
      component: () => import("@/views/bigScreen.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("@Pcomponents/page/default/404.vue"),
    },
  ],
});

export default router;
