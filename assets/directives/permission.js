import { watchEffect } from "vue";
import useSharedStore from "@Passets/stores/shared";

/**
 * 权限控制指令：根据 btnkey 控制元素显隐
 * 用法：v-permission="'user_add'" 或 v-permission="btnkey"
 */
export const permission = {
  mounted(el, binding) {
    const sharedStore = useSharedStore();
    const stop = watchEffect(() => {
      const btns = sharedStore.userInfo?.btns;
      const btnkey = binding.value;
      const has = !btnkey || btns === "all" || btns?.includes(btnkey);
      el.style.display = has ? "" : "none";
    });
    el.__permissionStop__ = stop;
  },
  unmounted(el) {
    el.__permissionStop__?.();
  },
};