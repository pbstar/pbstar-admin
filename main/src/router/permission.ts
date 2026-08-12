import type { Router } from "vue-router";
import { isFreeLogin, whiteList } from "@/utils/auth";

/**
 * 注册全局路由守卫（仅执行一次）
 * 统一处理登录态与白名单判断，避免在组件内重复注册累积
 * @param router vue-router 实例
 */
export function setupRouterGuards(router: Router) {
  router.beforeEach((to) => {
    // 免登录或白名单直接放行
    if (isFreeLogin || whiteList.includes(to.path)) {
      return true;
    }
    // 未登录跳转登录页
    if (!localStorage.getItem("p_token")) {
      return { path: "/login" };
    }
    return true;
  });
}
