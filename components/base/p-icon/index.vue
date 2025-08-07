<template>
  <!-- Element Plus 图标 -->
  <el-icon v-if="isElIcon" :size="size" :color="color">
    <component :is="elIconComponent" />
  </el-icon>
  <!-- Iconfont 图标 -->
  <i v-else class="iconfont" :class="[iconClass]" :style="iconStyle"></i>
</template>

<script setup>
import { computed } from "vue";
import * as ElIcons from "@element-plus/icons-vue";

const props = defineProps({
  // 图标名称
  name: {
    type: String,
    required: true,
  },
  // 图标大小
  size: {
    type: [String, Number],
    default: 16,
  },
  // 图标颜色
  color: {
    type: String,
    default: "",
  },
});

// 判断是否是Element Plus图标
const isElIcon = computed(() => props.name.startsWith("el-icon-"));

// 获取Element Plus图标组件
const elIconComponent = computed(() => {
  if (!isElIcon.value) return null;
  const iconName = props.name.replace("el-icon", "");
  // 首字母大写转换
  const formattedName = iconName.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  return ElIcons[formattedName] || null;
});

// Iconfont图标类名
const iconClass = computed(() => {
  if (isElIcon.value) return "";
  return `icon-${props.name}`;
});

// 图标样式
const iconStyle = computed(() => {
  const style = {};
  if (props.size) {
    style.fontSize =
      typeof props.size === "number" ? `${props.size}px` : props.size;
  }
  if (props.color) {
    style.color = props.color;
  }
  return style;
});
</script>

<style lang="scss" scoped>
.iconfont {
  display: inline-block;
  font-style: normal;
  line-height: 1;
  vertical-align: middle;
}
</style>
