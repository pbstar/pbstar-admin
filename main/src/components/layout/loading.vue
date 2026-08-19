<template>
  <div :class="['p-loading-mask', { fixed: isFixed }]" v-if="visible">
    <div class="p-loading-wrapper">
      <p-icon name="el-icon-Loading" size="24" />
      <span class="text">加载中...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { pIcon } from "@Pcomponents";
import useSharedStore from "@Passets/stores/shared";

const sharedStore = useSharedStore();
const props = defineProps({
  // 显式控制显隐；缺省时跟随子应用路由 loading 状态
  visible: {
    type: Boolean,
    default: undefined,
  },
  isFixed: {
    type: Boolean,
    default: false,
  },
});
const visible = computed(() => {
  if (props.visible !== undefined) {
    return props.visible;
  }
  return sharedStore.isAppRouteLoading;
});
</script>

<style scoped lang="scss">
.p-loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--c-bg);
  user-select: none;
  z-index: 6000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-loading-mask.fixed {
  position: fixed;
  width: 100vw;
  height: 100vh;
}

.p-loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  color: var(--c-text3);

  .text {
    font-size: var(--font-size-sm);
    color: var(--c-text2);
  }
}
</style>
