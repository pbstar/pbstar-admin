<template>
  <component
    :is="componentType"
    :model-value="props.modelValue"
    v-bind="componentProps"
    append-to-body
    :show-close="false"
    class="p-dialog-custom"
    destroy-on-close
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div class="dialog-header">
        <span>{{ props.title }}</span>
        <div class="dialog-header-btn-group">
          <p-icon
            name="el-icon-FullScreen"
            class="dialog-header-btn"
            @click="toggleFullscreen"
          />
          <p-icon
            name="el-icon-Close"
            size="20"
            class="dialog-header-btn"
            @click="emit('update:modelValue', false)"
          />
        </div>
      </div>
    </template>
    <slot />
    <template #footer>
      <slot name="footer" />
    </template>
  </component>
</template>

<script setup>
import { ref, computed } from "vue";
import { ElDialog, ElDrawer } from "element-plus";
import { pIcon } from "@Pcomponents";

const props = defineProps({
  type: {
    type: String,
    default: "box",
    validator: (value) => ["box", "drawer"].includes(value),
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

// 全屏状态
const isFullscreen = ref(false);

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

// 动态组件类型
const componentType = computed(() => {
  return props.type === "box" ? ElDialog : ElDrawer;
});

// 动态组件属性
const componentProps = computed(() => {
  const obj = {};
  if (props.type === "box") {
    obj.width = isFullscreen.value ? "100%" : props.width || "500px";
    obj.fullscreen = isFullscreen.value;
  } else {
    obj.size = isFullscreen.value ? "100%" : props.width || "400px";
  }
  return obj;
});
</script>

<style scoped lang="scss">
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--c-border);
}

.dialog-header-btn-group {
  display: flex;
  align-items: center;
}

.dialog-header-btn {
  cursor: pointer;
  margin-left: 10px;
}
</style>

<style lang="scss">
.p-dialog-custom {
  .el-drawer__header {
    margin-bottom: 0;
  }
  .el-drawer__body {
    padding-top: 0;
  }
  .el-dialog__header {
    padding-bottom: 0;
  }
}
</style>
