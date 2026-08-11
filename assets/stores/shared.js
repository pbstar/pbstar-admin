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

  /**
   * 写入用户信息（登录/免登初始化复用，仅保留前端需要的字段）
   * @param {{id:*,name:*,avatar:*,username:*,role:*,btns:*}} user 接口返回的用户对象
   */
  const setUserInfo = (user) => {
    userInfo.value = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      username: user.username,
      role: user.role,
      btns: user.btns,
    };
  };

  return {
    userInfo,
    isDark,
    isFull,
    isAppRouteLoading,
    setUserInfo,
  };
});
