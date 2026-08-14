<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string;
  }>(),
  {
    message: "子应用加载失败",
  },
);

defineEmits<{
  (e: "retry"): void;
}>();
</script>

<template>
  <div class="app-load-error">
    <el-empty :description="message">
      <el-button type="primary" @click="$emit('retry')">重试</el-button>
    </el-empty>
  </div>
</template>

<style scoped lang="scss">
.app-load-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--c-bg);
}
</style>
