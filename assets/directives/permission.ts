import { watchEffect } from "vue";
import type { Directive, DirectiveBinding } from "vue";
import useSharedStore from "@Passets/stores/shared";

/** 指令元素上挂载的清理函数（unmounted 时停止监听） */
type PermissionElement = HTMLElement & { __permissionStop__?: () => void };

/**
 * 权限控制指令：根据 btnkey 控制元素显隐
 * 用法：v-permission="'user_add'" 或 v-permission="btnkey"
 */
export const permission: Directive<HTMLElement, string> = {
  mounted(el, binding: DirectiveBinding<string>) {
    const sharedStore = useSharedStore();
    const stop = watchEffect(() => {
      const btns = sharedStore.userInfo?.btns;
      const btnkey = binding.value;
      const has = !btnkey || btns === "all" || btns?.includes(btnkey);
      el.style.display = has ? "" : "none";
    });
    (el as PermissionElement).__permissionStop__ = stop;
  },
  unmounted(el) {
    (el as PermissionElement).__permissionStop__?.();
  },
};
