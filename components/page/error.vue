<script setup lang="ts">
defineProps({
  // 状态码，如 "403"、"404"
  code: {
    type: String,
    default: "404",
  },
});
</script>
<template>
  <div class="box">
    <el-empty :description="code" />
  </div>
</template>
<style scoped lang="scss">
.box {
  width: 100%;
  padding-top: 60px;
  padding-bottom: 100px;
  background-color: var(--c-bg);
}
</style>
