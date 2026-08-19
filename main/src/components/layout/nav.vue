<script setup lang="ts">
import { useNavMenu, useSiderCollapse } from "@/components/layout/layout";
import { pIcon } from "@Pcomponents";
import MenuTree from "./MenuTree.vue";

const { listTree, activeIndex, selectNav } = useNavMenu();
const { collapsed, toggleCollapsed } = useSiderCollapse();
</script>

<template>
  <div class="navBox">
    <div class="menuScroll">
      <MenuTree
        :menuList="listTree"
        :activeIndex="activeIndex"
        :collapse="collapsed"
        isRoot
        @select="selectNav"
      />
    </div>
    <div class="collapseBtn" @click="toggleCollapsed">
      <p-icon :name="collapsed ? 'el-icon-Expand' : 'el-icon-Fold'" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.navBox {
  width: 100%;
  height: 100%;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .menuScroll {
    flex: 1;
    min-height: 0;
  }

  .collapseBtn {
    flex-shrink: 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--c-text2);
    border-top: 1px solid var(--c-border-light);
    cursor: pointer;
  }

  .collapseBtn:hover {
    color: var(--c-text3);
  }
}
</style>
