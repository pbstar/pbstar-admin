<template>
  <div class="dialog-footer">
    <el-button
      v-for="(item, index) in buttons"
      :key="index"
      :type="item.type || 'primary'"
      @click="$emit('button-click', item.key)"
    >
      {{ item.label }}
    </el-button>
  </div>
</template>

<script setup>
defineProps({
  buttons: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["button-click"]);
</script>
<style lang="scss" scoped>
.dialog-footer {
  width: 100%;
  height: 42px;
  background-color: var(--c-bg-box);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
}
</style>
