<script setup>
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  // 有text时，内容区域显示text
  text: {
    type: String,
    default: "",
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  // text是否换行
  isTextWrap: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="item">
    <!-- 标签区域 -->
    <div v-if="props.label" class="label">
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
        <div class="input" v-if="!props.text">
          <slot></slot>
        </div>
        <div
          v-if="props.text"
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
  width: 100px;
  line-height: 16px;
  margin-right: 6px;
  flex-shrink: 0;
  font-size: 14px;
  color: var(--c-text);
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .required {
    margin-right: 4px;
    color: red;
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
      padding: 0 6px;
      line-height: 30px;
      color: var(--c-text);
      border-bottom: 1px solid var(--c-border);
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
      padding: 5px 6px;
      line-height: 20px;
      color: var(--c-text);
      border-bottom: 1px solid var(--c-border);
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

@media screen and (max-width: 700px) {
  .label {
    width: 80px;
  }
}
</style>
