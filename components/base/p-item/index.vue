<script setup>
import { ref, watch } from "vue";
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

const props = defineProps({
  config: {
    type: Object,
    default: () => {},
  },
  modelValue: {
    type: [Number, String, Boolean, Array, Object],
    default: "",
  },
});
const emit = defineEmits(["change", "update:modelValue"]);
const components = {
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
const config = ref({
  key: "",
  label: "",
  type: "input",
  placeholder: "",
  isText: false,
  isRequired: false,
  isDisabled: false,
  tipText: "",
  rightText: "",
  labelStyle: "",
  options: [],
  enumKey: "",
  more: {},
});
const value = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    value.value = newVal;
  },
);
watch(
  () => props.config,
  (newVal) => {
    config.value = { ...config.value, ...newVal };
  },
  {
    immediate: true,
    deep: true,
  },
);

const change = (val) => {
  emit("update:modelValue", value.value);
  emit("change", val);
};
</script>
<template>
  <div class="item">
    <div class="label" v-if="config.label" :style="config.labelStyle">
      <span v-show="config.isRequired && !config.isText && !config.isDisabled"
        >*</span
      >
      <el-tooltip
        effect="dark"
        :content="config.label"
        placement="bottom"
        v-if="config.label.length > 8"
      >
        <span
          style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
          >{{ config.label }}</span
        >
      </el-tooltip>
      <span v-if="config.label.length <= 8">{{ config.label }}</span>
    </div>
    <div class="value">
      <div class="valBox" v-if="config.type != 'slot'">
        <div class="input">
          <component
            :is="components[config.type]"
            v-model="value"
            :config="config"
            @change="change"
          />
        </div>
        <div class="rightText" v-if="config.rightText">
          {{ config.rightText }}
        </div>
      </div>
      <slot v-else></slot>
      <div class="tipBox" v-if="config.tipText">
        {{ config.tipText }}
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
  span:nth-child(1) {
    margin-right: 4px;
    color: red;
  }
  span:nth-child(2) {
    text-align: right;
  }
}
.value {
  min-width: 150px;
  max-width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  .valBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 100%;
    .input {
      max-width: 100%;
      flex: 1;
    }
    .rightText {
      flex-shrink: 0;
      font-size: 14px;
      color: var(--c-text);
      margin-left: 6px;
    }
  }
  .tipBox {
    font-size: 12px;
    line-height: 16px;
    color: var(--c-text2);
    margin-top: 4px;
  }
}
@media screen and (max-width: 700px) {
  .label {
    width: 80px;
  }
}
</style>
