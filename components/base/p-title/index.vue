<template>
  <div class="p-title">
    <div class="tabs">
      <div v-for="(tab, i) in list" :key="i" :class="[
        'tab',
        { active: activeTab === i, disabled: list.length === 1 },
      ]" @click="selectTab(i)">
        {{ tab }}
      </div>
    </div>
    <div class="actions">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
const props = defineProps({
  list: { type: Array, default: () => [] },
  // 当前激活的 tab 下标（受控用法可配合 v-model 使用，非受控用法可不传）
  modelValue: { type: Number, default: 0 },
});

const emit = defineEmits(["change", "update:modelValue"]);
const activeTab = ref(props.modelValue);

// 支持外部通过 v-model 编程式切换 tab
watch(
  () => props.modelValue,
  (val) => {
    activeTab.value = val;
  },
);

const selectTab = (index: number) => {
  if (props.list.length === 1) return;
  activeTab.value = index;
  emit("update:modelValue", index);
  emit("change", { value: props.list[index], index });
};
</script>

<style lang="scss" scoped>
.p-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  border-bottom: 1px solid var(--c-border);

  .tabs {
    display: flex;
    flex-shrink: 0;

    .tab {
      margin-right: var(--space-5);
      line-height: 40px;
      cursor: pointer;
      font-size: var(--font-size-md);
      color: var(--c-text2);
      transition: color 0.15s;

      &:last-child {
        margin-right: 0;
      }

      &:not(.disabled):not(.active):hover {
        color: var(--c-text3);
      }

      &.active {
        color: var(--c-text);
        font-weight: 600;
        line-height: 34px;
        border-top: 3px solid transparent;
        border-bottom: 3px solid var(--c-bg-theme);
      }

      &.disabled {
        cursor: default;
      }
    }
  }

  .actions {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    overflow: hidden;
  }
}
</style>
