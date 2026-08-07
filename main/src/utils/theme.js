import useSharedStore from "@Passets/stores/shared";
import { bus } from "wujie";
import { changeTheme } from "@Passets/utils/theme";

/**
 * 主应用统一的主题切换入口
 * 同步 DOM、store，并通过 bus 广播给子应用（避免调用方分别处理三处）
 * @param {boolean} isDark 是否为暗色主题
 */
export function setTheme(isDark) {
  const sharedStore = useSharedStore();
  changeTheme(isDark);
  sharedStore.isDark = isDark;
  bus.$emit("changeSharedPinia", { isDark });
}