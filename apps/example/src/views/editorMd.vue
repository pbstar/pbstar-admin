<template>
  <div class="page">
    <p-title :list="['Markdown编辑器']"></p-title>
    <div class="content">
      <MdEditor
        v-model="text"
        :footers="[]"
        :noUploadImg="false"
        :toolbarsExclude="['github']"
        :theme="sharedStore.isDark ? 'dark' : 'light'"
      />
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { MdEditor } from "md-editor-v3";
import useSharedStore from "@Passets/stores/shared";
import "md-editor-v3/lib/style.css";
import PTitle from "@Pcomponents/base/p-title/index.vue";
const sharedStore = useSharedStore();
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
