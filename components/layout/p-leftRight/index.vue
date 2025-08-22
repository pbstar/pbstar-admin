<template>
  <el-splitter class="p-left-right">
    <el-splitter-panel
      class="left-panel"
      :size="leftWidth"
      :min="leftMinWidth"
      :max="leftMaxWidth"
    >
      <slot name="left" />
    </el-splitter-panel>

    <el-splitter-panel class="right-panel">
      <slot name="right" />
    </el-splitter-panel>
  </el-splitter>
</template>

<script setup>
const props = defineProps({
  leftWidth: {
    type: [String, Number],
    default: 220,
  },
  leftMinWidth: {
    type: [String, Number],
    default: 100,
  },
  leftMaxWidth: {
    type: [String, Number],
    default: 380,
  },
});
</script>

<style scoped lang="scss">
.p-left-right {
  width: 100%;

  :deep(.left-panel) {
    padding-right: 10px;
  }

  :deep(.right-panel) {
    padding-left: 10px;
  }
}
</style>
