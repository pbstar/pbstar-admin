<template>
  <div class="box">
    <div class="left">
      <div
        :class="{
          active: activeIndex === index,
          item: true,
          onlyOne: props.list.length === 1,
        }"
        v-for="(item, index) in props.list"
        :key="index"
        @click="toChange({ value: item, index })"
      >
        {{ item }}
      </div>
    </div>
    <div class="right">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["change"]);
const activeIndex = ref(0);
const toChange = ({ value, index }) => {
  activeIndex.value = index;
  emit("change", { value, index });
};
</script>
<style lang="scss" scoped>
.box {
  display: flex;
  height: 42px;
  border-bottom: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    flex-shrink: 0;
    height: 100%;
    .item {
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
        font-weight: 600;
        border-bottom: 3px solid var(--c-bg-theme);
      }
      &.onlyOne {
        cursor: default;
      }
    }
  }
  .right {
    flex: 1;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
