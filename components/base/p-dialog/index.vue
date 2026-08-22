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

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ElDialog, ElDrawer } from "element-plus";
import pIcon from "../p-icon/index.vue";

const props = defineProps({
  type: {
    type: String,
    default: "box",
    validator: (value: string) => ["box", "drawer"].includes(value),
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

const isFullscreen = ref(false);

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

// 关闭弹窗后重置全屏状态，避免下次打开残留全屏态
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      isFullscreen.value = false;
    }
  },
);

const componentType = computed(() => {
  return props.type === "box" ? ElDialog : ElDrawer;
});

const componentProps = computed(() => {
  const obj: Record<string, string | boolean> = {};
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
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--c-border);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--c-text);
}

.dialog-header-btn-group {
  display: flex;
  align-items: center;
}

.dialog-header-btn {
  cursor: pointer;
  margin-left: var(--space-3);
  color: var(--c-text2);
  border-radius: var(--radius-sm);
  transition: color 0.15s;

  &:hover {
    color: var(--c-text3);
  }
}
</style>

<style lang="scss">
.p-dialog-custom {
  --el-dialog-border-radius: var(--radius-lg);

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
