<template>
  <div class="icon-list">
    <div
      v-for="(icon, index) in icons"
      :key="index"
      class="icon-item"
      :class="{ active: active === icon }"
      @click="$emit('select', icon)"
    >
      <p-icon class="icon" :name="icon" size="20" />
      <div class="name">{{ icon }}</div>
    </div>
  </div>
</template>

<script setup>
import pIcon from "../../base/p-icon/index.vue";
defineProps({
  icons: {
    type: Array,
    default: () => [],
  },
  active: {
    type: String,
    default: "",
  },
});

defineEmits(["select"]);
</script>

<style scoped lang="scss">
.icon-list {
  display: flex;
  flex-wrap: wrap;
  height: 510px;
  overflow-y: auto;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 15px 5px;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  margin-right: 8px;
  margin-top: 8px;
  width: 158px;

  .icon {
    margin-bottom: 5px;
  }

  .name {
    width: 100%;
    font-size: 13px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    border-color: var(--c-text3);
  }

  &.active {
    border-color: var(--c-text3);
    background-color: var(--c-bg-theme);
    color: var(--c-text-theme);
  }
}

.icon-item:nth-child(4n) {
  margin-right: 0;
}

.icon-item:nth-child(-n + 4) {
  margin-top: 0;
}
</style>
