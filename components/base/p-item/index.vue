<script setup>
import { ref, watch, computed } from "vue";
import pInput from "./input.vue";
import pTextarea from "./textarea.vue";
import pInputNumber from "./inputNumber.vue";
import pSelect from "./select.vue";
import pSelectMultiple from "./selectMultiple.vue";
import pSelectTree from "./selectTree.vue";
import pRadio from "./radio.vue";
import pCheckbox from "./checkbox.vue";
import pDate from "./date.vue";
import pDateRange from "./dateRange.vue";
import pDateTime from "./dateTime.vue";
import pDateTimeRange from "./dateTimeRange.vue";

// 组件映射
const componentMap = {
  input: pInput,
  textarea: pTextarea,
  inputNumber: pInputNumber,
  select: pSelect,
  selectMultiple: pSelectMultiple,
  selectTree: pSelectTree,
  radio: pRadio,
  checkbox: pCheckbox,
  date: pDate,
  dateRange: pDateRange,
  dateTime: pDateTime,
  dateTimeRange: pDateTimeRange,
};

// Props 定义
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
  modelValue: {
    type: [Number, String, Boolean, Array, Object],
    default: "",
  },
});

// Emits 定义
const emit = defineEmits(["change", "update:modelValue"]);

// 默认配置
const defaultConfig = {
  key: "",
  label: "",
  type: "input",
  placeholder: "",
  isText: false,
  isRequired: false,
  isDisabled: false,
  options: [],
  enumKey: "",
  more: {},
};

// 状态管理
const config = ref({ ...defaultConfig });
const value = ref(props.modelValue);

// 监听属性变化
watch(
  () => props.modelValue,
  (val) => (value.value = val),
);
watch(
  () => props.config,
  (val) => {
    config.value = { ...defaultConfig, ...val };
  },
  { immediate: true, deep: true },
);

// 事件处理
const handleChange = (val) => {
  emit("update:modelValue", value.value);
  emit("change", val);
};

// 计算属性
const currentComponent = computed(
  () => componentMap[config.value.type] || pInput,
);
</script>

<template>
  <div class="item">
    <!-- 标签区域 -->
    <div v-if="config.label" class="label">
      <span
        v-show="config.isRequired && !config.isText && !config.isDisabled"
        class="required"
        >*</span
      >
      <el-tooltip
        v-if="config.label.length > 8"
        effect="dark"
        :content="config.label"
        placement="bottom"
      >
        <span class="label-text">{{ config.label }}</span>
      </el-tooltip>

      <span v-else class="label-text">{{ config.label }}</span>
    </div>

    <!-- 内容区域 -->
    <div class="value">
      <div class="val-box">
        <div class="input">
          <slot :config="config" :modelValue="value">
            <component
              :is="currentComponent"
              v-model="value"
              :config="config"
              @change="handleChange"
            />
          </slot>
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
