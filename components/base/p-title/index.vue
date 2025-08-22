<template>
  <div class="p-title">
    <div class="tabs">
      <div
        v-for="(tab, i) in list"
        :key="i"
        :class="[
          'tab',
          { active: activeTab === i, disabled: list.length === 1 },
        ]"
        @click="selectTab(i)"
      >
        {{ tab }}
      </div>
    </div>
    <div class="actions">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  list: { type: Array, default: () => [] },
});

const emit = defineEmits(["change"]);
const activeTab = ref(0);

const selectTab = (index) => {
  if (props.list.length === 1) return;
  activeTab.value = index;
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
      margin-right: 20px;
      line-height: 40px;
      cursor: pointer;
      font-size: 14px;
      color: var(--c-text2);

      &:last-child {
        margin-right: 0;
      }

      &.active {
        color: var(--c-text);
        font-weight: bold;
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
