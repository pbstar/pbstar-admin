<template>
  <div :class="collapseClasses">
    <el-collapse v-model="activeName">
      <el-collapse-item
        :title="props.title"
        name="1"
        :disabled="!props.isControl"
      >
        <template #title>
          <div class="title">
            <span class="bar"></span>
            <span>{{ props.title }}</span>
          </div>
        </template>
        <template #icon="{ isActive }">
          <p-icon
            class="btn"
            :name="isActive ? 'el-icon-ArrowUp' : 'el-icon-ArrowDown'"
            :size="14"
          />
        </template>
        <slot></slot>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import pIcon from "../p-icon/index.vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  isCollapse: {
    type: Boolean,
    default: false,
  },
  isControl: {
    type: Boolean,
    default: true,
  },
  showDownLine: {
    type: Boolean,
    default: true,
  },
});

const activeName = ref(props.isCollapse ? "" : "1");

// 响应外部对 isCollapse 的动态修改
watch(
  () => props.isCollapse,
  (val) => {
    activeName.value = val ? "" : "1";
  },
);

const collapseClasses = computed(() => ({
  collapse: true,
  control: !props.isControl,
  downLine: !props.showDownLine,
}));
</script>
<style lang="scss" scoped>
.collapse {
  width: 100%;
  margin-bottom: 1px;
  :deep(.btn) {
    color: var(--c-text2);
    transition: color 0.15s;
  }
  :deep(.el-collapse-item__header:hover .btn) {
    color: var(--c-text3);
  }
  :deep(.el-collapse),
  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }
  :deep(.el-collapse) {
    border-top: none;
  }
  :deep(.el-collapse-item__header) {
    width: 100%;
    height: 50px;
    border-bottom: 1px solid var(--c-border);
  }
  :deep(.el-collapse-item__content) {
    padding: 0;
  }
  .title {
    display: flex;
    align-items: center;
    .bar {
      width: 3px;
      height: 14px;
      border-radius: 2px;
      background: var(--c-bg-theme);
    }
    span:last-child {
      color: var(--c-text);
      font-weight: 600;
      font-size: var(--font-size-md);
      margin-left: var(--space-2);
    }
  }
}
.collapse.control {
  :deep(.el-collapse-item__header) {
    cursor: default;
    .btn {
      visibility: hidden;
    }
  }
}
.collapse.downLine {
  :deep(.el-collapse-item__header) {
    border-bottom: none;
  }
}
</style>
