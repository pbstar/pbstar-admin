<template>
  <div
    :class="{
      collapse: true,
      control: !props.isControl,
      downLine: !props.showDownLine,
    }"
  >
    <el-collapse v-model="activeName">
      <el-collapse-item title="Consistency" name="1" :disabled="!isControl">
        <template #title>
          <div class="title">
            <img src="@Passets/imgs/sa_quan.png" alt="" />
            <span>{{ props.title }}</span>
          </div>
        </template>
        <template #icon="{ isActive }">
          <img
            class="btn"
            v-show="!isActive"
            src="@Passets/imgs/jian_down.png"
            alt=""
          />
          <img
            class="btn"
            v-show="isActive"
            src="@Passets/imgs/jian_up.png"
            alt=""
          />
        </template>
        <slot></slot>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  isCollapse: {
    type: Boolean,
    default: false,
  },
  //是否可控
  isControl: {
    type: Boolean,
    default: true,
  },
  //显示下划线
  showDownLine: {
    type: Boolean,
    default: true,
  },
});
const activeName = ref(props.isCollapse ? "" : "1");
</script>
<style lang="scss" scoped>
.collapse {
  width: 100%;
  margin-bottom: 1px;
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
    span {
      color: var(--c-text);
      font-weight: bold;
      font-size: 14px;
      margin-left: 9px;
    }
  }
}
.collapse.control {
  :deep(.el-collapse-item__header) {
    cursor: default;
    .btn {
      display: none;
    }
  }
}
.collapse.downLine {
  :deep(.el-collapse-item__header) {
    border-bottom: none;
  }
}
</style>
