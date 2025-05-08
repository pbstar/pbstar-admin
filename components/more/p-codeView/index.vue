<template>
  <div class="code-preview-container">
    <div class="code-toolbar">
      <span class="language-tag">{{ language }}</span>
      <div class="tool-buttons">
        <button @click="copyCode" title="复制代码">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="currentColor"
              d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
            />
          </svg>
        </button>
        <button @click="downloadCode" title="下载代码">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="currentColor"
              d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"
            />
          </svg>
        </button>
      </div>
    </div>
    <pre class="code-block">
      <code class="hljs" v-html="code"></code>
    </pre>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/vs2015.min.css";
const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "vue",
  },
  filename: {
    type: String,
    default: "code.vue",
  },
});

const code = ref("");
code.value = hljs.highlightAuto(props.code, [
  "vue",
  "js",
  "javascript",
  "ts",
  "typescript",
  "css",
  "scss",
  "html",
]).value;

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    ElMessage.success("代码已复制到剪贴板");
  } catch (err) {
    ElMessage.error("复制失败，请手动复制");
  }
};

const downloadCode = () => {
  const blob = new Blob([props.code], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = props.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  ElMessage.success("代码已下载");
};
</script>

<style scoped lang="scss">
.code-preview-container {
  border: 1px solid #2d333b;
  border-radius: 6px;
  background-color: #22272e;
  margin: 10px 0;
  overflow: hidden;
}

.code-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background-color: #2d333b;
  border-bottom: 1px solid #444c56;
}

.language-tag {
  font-size: 12px;
  color: #adbac7;
  text-transform: uppercase;
  font-family: monospace;
}

.tool-buttons {
  display: flex;
  gap: 8px;
}

.tool-buttons button {
  background: none;
  border: none;
  color: #768390;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.tool-buttons button:hover {
  color: #adbac7;
  background-color: #444c56;
}

.code-block {
  margin: 0;
  padding: 0;
  overflow-x: auto;
  color: #adbac7;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 14px;
  line-height: 1.5;
  display: flex;
  .hljs {
    background-color: inherit;
    padding: 16px 18px;
  }
}

/* 滚动条样式 */
.code-block::-webkit-scrollbar {
  height: 8px;
}

.code-block::-webkit-scrollbar-track {
  background: #2d333b;
}

.code-block::-webkit-scrollbar-thumb {
  background: #444c56;
  border-radius: 4px;
}

.code-block::-webkit-scrollbar-thumb:hover {
  background: #768390;
}
</style>
