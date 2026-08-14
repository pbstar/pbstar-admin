<script setup lang="ts">
import { useNavMenu } from "@/components/layout/layout";
import MenuTree from "./MenuTree.vue";

const { listTree, activeIndex, selectNav } = useNavMenu();
</script>

<template>
  <div class="navBox">
    <MenuTree
      :menuList="listTree"
      :activeIndex="activeIndex"
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
