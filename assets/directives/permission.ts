import { watchEffect } from "vue";
import type { Directive, DirectiveBinding } from "vue";
import useSharedStore from "@Passets/stores/shared";
import { hasPermission } from "@Passets/utils/permission";

/** 指令元素上挂载的清理函数（unmounted 时停止监听） */
type PermissionElement = HTMLElement & { __permissionStop__?: () => void };

/**
 * 权限控制指令：根据 key 精确匹配控制元素显隐
 * 用法：v-permission="'user_add'" 或 v-permission="key"
 */
export const permission: Directive<HTMLElement, string> = {
  mounted(el, binding: DirectiveBinding<string>) {
    const sharedStore = useSharedStore();
    const stop = watchEffect(() => {
      const has = hasPermission(binding.value, sharedStore.userInfo?.permissions);
      el.style.display = has ? "" : "none";
    });
    (el as PermissionElement).__permissionStop__ = stop;
  },
  unmounted(el) {
    (el as PermissionElement).__permissionStop__?.();
  },
};
