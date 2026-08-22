import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/list",
      name: "list",
      component: () => import("@/views/list/index.vue"),
    },
    {
      path: "/echarts",
      name: "echarts",
      component: () => import("@/views/echarts/index.vue"),
    },
    {
      path: "/editorMd",
      name: "editorMd",
      component: () => import("@/views/editorMd/index.vue"),
    },
    {
      path: "/editorRt",
      name: "editorRt",
      component: () => import("@/views/editorRt/index.vue"),
    },
    {
      path: "/bigScreen",
      name: "bigScreen",
      component: () => import("@/views/bigScreen/index.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("@Pcomponents/page/error.vue"),
    },
  ],
});

export default router;
