<template>
  <el-icon v-if="iconType === 'ep'" :size="size" :color="color">
    <component :is="epIcon" />
  </el-icon>
  <i
    v-else-if="iconType === 'icon'"
    class="el-icon iconfont"
    :class="name"
    :style="iconStyle"
  ></i>
</template>

<script setup>
import { computed } from "vue";
import * as ElIcons from "@element-plus/icons-vue";
import "@Passets/iconfont/iconfont.css";

const props = defineProps({
  name: { type: String, default: "" },
  size: { type: [String, Number], default: 16 },
  color: { type: String, default: "" },
});

const iconType = computed(() =>
  props.name?.startsWith("el-icon-")
    ? "ep"
    : props.name?.startsWith("p-icon-")
      ? "icon"
      : "",
);

const epIcon = computed(() => {
  if (iconType.value !== "ep") return null;
  const iconName = props.name
    .replace("el-icon", "")
    .replace(/-(\w)/g, (_, c) => c.toUpperCase());
  return ElIcons[iconName] || null;
});

const iconStyle = computed(() => {
  const size = props.size;
  return {
    fontSize: isNaN(Number(size)) ? size : `${size}px`,
    color: props.color,
  };
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
