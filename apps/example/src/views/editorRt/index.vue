<template>
  <div class="page">
    <p-title :list="['富文本编辑器']"></p-title>
    <div class="content">
      <div class="editor">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
        />
        <Editor
          style="height: 500px; overflow-y: hidden"
          v-model="valueHtml"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef } from "vue";
import { Editor, Toolbar } from "@wangeditor-next/editor-for-vue";
import type { IDomEditor } from "@wangeditor-next/editor";
import "@wangeditor-next/editor/dist/css/style.css";
import { pTitle } from "@Pcomponents";
const editorRef = shallowRef<IDomEditor>();

// 编辑器模式（default 富文本 / simple 简洁）
const mode: "default" | "simple" = "default";

const valueHtml = ref("<p>hello world</p>");
const toolbarConfig = {};
const editorConfig = {};

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
};
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  padding: 0 10px 10px;
  background-color: var(--c-bg);
  .content {
    width: 100%;
    padding: 10px 0;
    .editor {
      width: 100%;
      border: 1px solid #ccc;
    }
  }
}
</style>
