<template>
  <div :class="['p-loading-mask', { fixed: isFixed }]" v-if="visible">
    <div class="p-loading-wrapper">
      <span class="p-loading-dot"><i></i><i></i><i></i><i></i></span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import useSharedStore from "@Passets/stores/shared";

const sharedStore = useSharedStore();
const props = defineProps({
  type: {
    type: String,
    default: "appRoute",
  },
  isFixed: {
    type: Boolean,
    default: false,
  },
});
const visible = computed(() => {
  if (props.type === "appRoute") {
    return sharedStore.isAppRouteLoading;
  }
  return true;
});
</script>

<style scoped lang="scss">
/* Loading 样式 */
.p-loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--c-bg);
  user-select: none;
  z-index: 6000;
  overflow: hidden;
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
}

.p-loading-dot {
  animation: p-loading-rotate 1.2s infinite linear;
  transform: rotate(45deg);
  position: relative;
  display: inline-block;
  font-size: 64px;
  width: 64px;
  height: 64px;
  box-sizing: border-box;
}

.p-loading-dot i {
  width: 22px;
  height: 22px;
  position: absolute;
  display: block;
  background-color: var(--c-text3);
  border-radius: 100%;
  transform: scale(0.75);
  transform-origin: 50% 50%;
  opacity: 0.3;
  animation: p-loading-spin 1s infinite linear alternate;
}

.p-loading-dot i:nth-child(1) {
  top: 0;
  left: 0;
}

.p-loading-dot i:nth-child(2) {
  top: 0;
  right: 0;
  animation-delay: 0.4s;
}

.p-loading-dot i:nth-child(3) {
  right: 0;
  bottom: 0;
  animation-delay: 0.8s;
}

.p-loading-dot i:nth-child(4) {
  bottom: 0;
  left: 0;
  animation-delay: 1.2s;
}

@keyframes p-loading-rotate {
  to {
    transform: rotate(405deg);
  }
}

@keyframes p-loading-spin {
  to {
    opacity: 1;
  }
}
</style>
