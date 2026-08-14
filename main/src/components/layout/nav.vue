<script setup lang="ts">
import { useNavMenu } from "@/components/layout/layout";
import MenuTree from "./MenuTree.vue";

// 折叠状态由顶部 AppHeader 的按钮统一触发（避免多处按钮做同一件事）
const { listTree, activeIndex, selectNav, isCollapse } = useNavMenu();
</script>

<template>
  <div class="navBox">
    <MenuTree
      :menuList="listTree"
      :activeIndex="activeIndex"
      :collapse="isCollapse"
      isRoot
      @select="selectNav"
    />
  </div>
</template>

<style scoped lang="scss">
.navBox {
  width: 100%;
  height: 100%;
  background: var(--c-bg);
  overflow: hidden;
}
</style>
