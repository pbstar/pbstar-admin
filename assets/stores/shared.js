import { ref } from "vue";
import { defineStore } from "pinia";

/**
 * 共享状态store
 */
export default defineStore("shared", () => {
  const userInfo = ref(null); // 用户信息
  const isDark = ref(false); // 暗黑模式
  const isFull = ref(false); // 全屏状态
  const isAppRouteLoading = ref(false); // 应用路由loading状态

  return {
    userInfo,
    isDark,
    isFull,
    isAppRouteLoading,
  };
});
