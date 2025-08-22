<template>
  <div class="dialog-header" :class="{ drawer }">
    <div class="header-left">
      <div class="title">{{ title }}</div>
    </div>
    <div class="header-right">
      <img
        src="@Passets/imgs/icons14/close.png"
        alt=""
        @click="$emit('close')"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  drawer: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["close"]);
</script>
<style lang="scss" scoped>
.dialog-header {
  width: 100%;
  height: 42px;
  background: var(--c-bg-theme);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  &.drawer {
    height: 50px;
    padding: 0 14px;

    .header-left {
      width: 80%;
      height: 100%;
      display: flex;
      align-items: center;

      .title {
        font-weight: bold;
        font-size: 18px;
        line-height: 40px;
        color: var(--c-text-theme);
      }
    }

    .header-right img {
      cursor: pointer;
    }
  }

  .title {
    font-size: 16px;
    line-height: 20px;
    color: var(--c-text-theme);
  }

  img {
    cursor: pointer;
  }
}
</style>
