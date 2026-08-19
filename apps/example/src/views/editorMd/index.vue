<template>
  <div class="page">
    <p-title :list="['Markdown编辑器']"></p-title>
    <div class="content">
      <MdEditor
        v-model="text"
        :footers="[]"
        :noUploadImg="false"
        :toolbarsExclude="['github']"
        :theme="'light'"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { pTitle } from "@Pcomponents";
const text = ref("## hello world");
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  padding: 0 10px;
  background-color: var(--c-bg);
  .content {
    width: 100%;
    padding: 10px 0;
  }
}
</style>
