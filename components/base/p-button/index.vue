<template>
  <el-button v-bind="$attrs" v-if="hasPermission">
    <!-- 默认内容插槽 -->
    <slot>
      {{ text }}
    </slot>

    <!-- 后置图标插槽 -->
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>

    <!-- 加载状态插槽 -->
    <template v-if="$slots.loading" #loading>
      <slot name="loading" />
    </template>
  </el-button>
</template>

<script setup>
import { computed } from "vue";
import useSharedStore from "@Passets/stores/shared";

// 权限验证
const sharedStore = useSharedStore();
const userButtons = computed(() => sharedStore.userInfo?.btns || []);

// 组件属性
const props = defineProps({
  // 权限标识
  auth: {
    type: String,
    default: "",
  },
  // 按钮文本（当默认插槽为空时使用）
  text: {
    type: String,
    default: "",
  },
});

// 权限验证
const hasPermission = computed(() => {
  if (!props.auth) return true;
  return userButtons.value.includes(props.auth);
});
</script>
