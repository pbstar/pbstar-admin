import { ref } from "vue";
import { defineStore } from "pinia";

/**
 * 共享状态store
 */
export default defineStore("shared", () => {
  const userInfo = ref(null); // 用户信息
  const isDark = ref(false); // 暗黑模式
  const isFull = ref(false); // 全屏状态
  const dialogIndex = ref(1000); // 对话框z-index基数

  /**
   * 获取递增的z-index值
   * @returns {number} 新的z-index值
   */
  const getNextZIndex = () => {
    dialogIndex.value += 2;
    return dialogIndex.value;
  };

  return {
    userInfo,
    isDark,
    isFull,
    getIndex: getNextZIndex,
  };
});
