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
<script setup>
import { onBeforeUnmount, ref, shallowRef } from "vue";
import { Editor, Toolbar } from "@wangeditor-next/editor-for-vue";
import "@wangeditor-next/editor/dist/css/style.css"; // 引入 css
import { PTitle } from "@Pcomponents";
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref("<p>hello world</p>");
const toolbarConfig = {};
const editorConfig = {};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  padding: 0 10px;
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
