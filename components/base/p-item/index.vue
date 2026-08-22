<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  showText: {
    type: Boolean,
    default: false,
  },
  text: {
    type: [String, Number],
    default: "",
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  isTextWrap: {
    type: Boolean,
    default: false,
  },
  labelWidth: {
    type: String,
    default: "100px",
  },
});
</script>

<template>
  <div class="item">
    <!-- 标签区域 -->
    <div v-if="props.label" class="label" :style="{ width: props.labelWidth }">
      <span v-show="props.isRequired" class="required">*</span>
      <el-tooltip
        v-if="props.label.length > 8"
        effect="dark"
        :content="props.label"
        placement="bottom"
      >
        <span class="label-text">{{ props.label }}</span>
      </el-tooltip>
      <span v-else class="label-text">{{ props.label }}</span>
    </div>
    <!-- 内容区域 -->
    <div class="value">
      <div class="val-box">
        <div class="input" v-if="!props.showText">
          <slot></slot>
        </div>
        <div
          v-else
          :class="props.isTextWrap ? 'val-text-wrap' : 'val-text'"
        >
          {{ props.text }}
        </div>
        <div v-if="$slots.right" class="right-text">
          <slot name="right" />
        </div>
      </div>
      <div v-if="$slots.bottom" class="tip-box">
        <slot name="bottom" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item {
  display: flex;
}

.label {
  height: 30px;
  line-height: 16px;
  margin-right: var(--space-2);
  flex-shrink: 0;
  font-size: var(--font-size-md);
  color: var(--c-text2);
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .required {
    margin-right: 4px;
    color: var(--el-color-danger, #f56c6c);
  }

  .label-text {
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.value {
  min-width: 150px;
  max-width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;

  .val-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 100%;

    .input {
      max-width: 100%;
      flex: 1;
    }

    .val-text {
      max-width: 100%;
      flex: 1;
      height: 30px;
      padding: 0 var(--space-2);
      line-height: 30px;
      color: var(--c-text);
      background: var(--c-bg-box);
      border-radius: var(--radius-sm);
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      ::-webkit-scrollbar {
        width: 2px;
        height: 2px;
      }
    }

    .val-text-wrap {
      max-width: 100%;
      flex: 1;
      height: auto;
      min-height: 30px;
      padding: 5px var(--space-2);
      line-height: 20px;
      color: var(--c-text);
      background: var(--c-bg-box);
      border-radius: var(--radius-sm);
      word-break: break-word;
    }

    .right-text {
      flex-shrink: 0;
      margin-left: 6px;
    }
  }

  .tip-box {
    margin-top: 4px;
  }
}
</style>
