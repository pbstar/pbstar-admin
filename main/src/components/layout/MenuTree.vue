<template>
  <!-- 根：渲染菜单容器 -->
  <el-menu
    v-if="isRoot"
    class="menu"
    :default-active="activeIndex"
    @select="handleSelect"
  >
    <MenuTree
      v-for="(item, index) in menuList"
      :key="index"
      :node="item"
    />
  </el-menu>
  <!-- 子节点：有 children 递归展开 -->
  <el-sub-menu v-else-if="node.children" :index="String(node.id)">
    <template #title>
      <p-icon v-if="node.icon" :name="node.icon" />
      <span>{{ node.name }}</span>
    </template>
    <MenuTree
      v-for="(child, i) in node.children"
      :key="i"
      :node="child"
    />
  </el-sub-menu>
  <!-- 叶子节点 -->
  <el-menu-item v-else :index="String(node.id)">
    <p-icon v-if="node.icon" :name="node.icon" />
    <span>{{ node.name }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { pIcon } from "@Pcomponents";

defineOptions({ name: "MenuTree" });

const props = withDefaults(
  defineProps<{
    menuList?: any[];
    activeIndex?: string;
    isRoot?: boolean;
    node?: any;
  }>(),
  {
    menuList: () => [],
    activeIndex: "",
    isRoot: false,
    node: () => ({}),
  },
);

const emit = defineEmits<{
  (e: "select", index: string): void;
}>();

const handleSelect = (index: string) => {
  emit("select", index);
};
</script>

<style scoped lang="scss">
.menu {
  height: 100%;
  padding: 10px 0;
  overflow-y: auto;
  border-right: 0;
  background: transparent !important;
}

/* 菜单项基础样式 */
.menu :deep(.el-menu-item),
.menu :deep(.el-sub-menu__title) {
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  margin: 0 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  color: var(--c-text);
  padding: 0 12px !important;
}

/* 激活状态样式 */
.menu :deep(.el-menu-item.is-active) {
  background: var(--c-menu-active-bg) !important;
  color: var(--c-text3) !important;
  position: relative;
}

.menu :deep(.el-menu-item.is-active)::after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: var(--c-text3);
  border-radius: 2px;
}

/* 悬停效果 */
.menu :deep(.el-menu-item:hover),
.menu :deep(.el-sub-menu__title:hover) {
  background: var(--c-menu-hover-bg) !important;
}

/* 子菜单缩进 */
.menu :deep(.el-sub-menu .el-menu-item) {
  margin-left: 24px;
}

/* 图标样式 */
.menu :deep(.el-icon) {
  font-size: 18px;
  vertical-align: middle;
  color: var(--c-text3);
}

/* 子菜单箭头 */
.menu :deep(.el-sub-menu__icon-arrow) {
  color: var(--c-text);
  margin-right: 0;
  top: 16px;
  right: 12px;
}

/* 滚动条美化 */
.menu::-webkit-scrollbar {
  width: 6px;
}

.menu::-webkit-scrollbar-track {
  background: var(--c-scrollbar-track);
  border-radius: 4px;
}

.menu::-webkit-scrollbar-thumb {
  background: var(--c-scrollbar-thumb);
  border-radius: 4px;
}
</style>