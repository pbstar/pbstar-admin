<template>
  <!-- Element Plus 图标 -->
  <el-icon v-if="iconType == 'ep'" :size="size" :color="color">
    <component :is="epComponent" />
  </el-icon>
  <!-- Iconfont 图标 -->
  <i
    v-else-if="iconType == 'icon'"
    class="iconfont"
    :class="name"
    :style="iconStyle"
  ></i>
</template>

<script setup>
import { computed } from "vue";
import * as ElIcons from "@element-plus/icons-vue";
import "@Passets/iconfont/iconfont.css";

const props = defineProps({
  // 图标名称
  name: {
    type: String,
    default: "el-icon-loading",
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

const iconType = computed(() => {
  if (props.name.startsWith("el-icon-")) {
    return "ep";
  } else if (props.name.startsWith("p-icon-")) {
    return "icon";
  }
});

// 获取Element Plus图标组件
const epComponent = computed(() => {
  if (iconType.value != "ep") return null;
  const iconName = props.name
    .replace("el-icon", "")
    .replace(/-(\w)/g, (_, c) => c.toUpperCase());
  return ElIcons[iconName] || null;
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
