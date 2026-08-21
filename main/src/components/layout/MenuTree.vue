<template>
  <!-- 根：渲染菜单容器 -->
  <el-menu
    v-if="isRoot"
    class="menu"
    :class="{ collapsed: collapse }"
    :default-active="activeIndex"
    :collapse="collapse"
    :collapse-transition="false"
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
    collapse?: boolean;
  }>(),
  {
    menuList: () => [],
    activeIndex: "",
    isRoot: false,
    node: () => ({}),
    collapse: false,
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
  height: 38px;
  line-height: 38px;
  margin: 0 10px;
  margin-bottom: 4px;
  border-radius: var(--radius-md);
  color: var(--c-text);
  padding: 0 12px !important;
  transition: background-color 0.15s, color 0.15s;
}

/* 激活状态：浅色 tint 背景 + 左侧主色条 + 文字主题色 */
.menu :deep(.el-menu-item.is-active) {
  background: var(--c-menu-active-bg) !important;
  color: var(--c-text3) !important;
  position: relative;
  font-weight: 600;
}

.menu :deep(.el-menu-item.is-active)::after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 18px;
  border-radius: 2px;
  background: var(--c-bg-theme);
}

/* 悬停效果：淡背景 + 文字主题色 */
.menu :deep(.el-menu-item:hover),
.menu :deep(.el-sub-menu__title:hover) {
  background: var(--c-menu-hover-bg) !important;
  color: var(--c-text3) !important;
}

/* 子菜单缩进 */
.menu :deep(.el-sub-menu .el-menu-item) {
  margin-left: 24px;
}

/* 菜单项文字过长时省略号，避免单行溢出（折叠态文字由 el-menu 隐藏，仅展开态生效） */
.menu:not(.collapsed) :deep(.el-menu-item span),
.menu:not(.collapsed) :deep(.el-sub-menu__title span) {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 折叠态：菜单项收窄为图标居中，不再有左右外边距 */
.menu.collapsed :deep(.el-menu-item),
.menu.collapsed :deep(.el-sub-menu__title) {
  margin: 0 8px 4px;
  padding: 0 !important;
  justify-content: center;
}

.menu.collapsed :deep(.el-sub-menu .el-menu-item) {
  margin-left: 8px;
}

/* 图标样式 */
.menu :deep(.el-icon) {
  font-size: 18px;
  vertical-align: middle;
  color: var(--c-text2);
  transition: color 0.15s;
}

/* 激活/悬停时图标跟随文字变主题色 */
.menu :deep(.el-menu-item:hover .el-icon),
.menu :deep(.el-sub-menu__title:hover .el-icon),
.menu :deep(.el-menu-item.is-active .el-icon) {
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