<script setup>
import { ref, watch } from "vue";
import { useEnumStore } from "@Passets/stores/enum";
const enumStore = useEnumStore();
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  modelValue: {
    type: [Number, String, Boolean, Array, Object],
    default: "",
  },
});
const emit = defineEmits(["change", "update:modelValue"]);
const getPlaceholder = (item) => {
  const placeholderMap = {
    input: "请输入",
    textarea: "请输入",
    inputNumber: "请输入",
    select: "请选择",
    selectMultiple: "请选择",
    date: "请选择",
    daterange: "请选择",
    datetime: "请选择",
    datetimerange: "请选择",
  };
  return placeholderMap[item.type] || "";
};
const item = ref({
  key: "",
  label: "",
  type: "input",
  placeholder: getPlaceholder(props.item),
  isText: false,
  isRequired: false,
  isDisabled: false,
  options: [],
  labelStyle: "",
  enumType: "",
  tipText: "",
  rightText: "",
});
const value = ref("");
const text = ref("");
const changeText = (arr) => {
  let obj = arr.find((it) => it.value == value.value);
  if (obj) {
    text.value = obj.label;
  } else {
    text.value = "";
  }
};
watch(
  () => props.modelValue,
  (newVal) => {
    value.value = newVal;
    if (
      item.value.isText &&
      item.value.options &&
      item.value.options.length > 0
    ) {
      changeText(item.value.options);
    }
  },
  {
    immediate: true,
  }
);
watch(
  () => props.item,
  (newVal) => {
    item.value = { ...item.value, ...newVal };
  },
  {
    immediate: true,
    deep: true,
  }
);
watch(
  () => item.value.enumType,
  (newVal) => {
    if (newVal) {
      enumStore.getEnum(item.value.enumType).then((res) => {
        if (res) {
          let list = res[item.value.enumType];
          item.value.options = list.map((it) => {
            return {
              label: it.enumValue,
              value: it.enumKey,
            };
          });
          if (item.value.isText) {
            changeText(item.value.options);
          }
        }
      });
    }
  },
  {
    immediate: true,
  }
);
watch(
  () => item.value.options,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      if (item.value.isText) {
        changeText(newVal);
      }
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
const change = (val) => {
  let row = {};
  if (item.value.options && item.value.options.length > 0) {
    row = item.value.options.find((it) => it.value == value.value);
  }
  emit("update:modelValue", value.value);
  emit("change", {
    key: item.value.key,
    type: item.value.type,
    value: val,
    row,
  });
};
</script>
<template>
  <div class="item">
    <div class="label" v-if="item.label" :style="item.labelStyle">
      <span
        v-show="item.isRequired && !item.isText && !item.isDisabled"
        style="color: red"
        >*</span
      >
      <span>{{ item.label }}</span>
    </div>
    <div class="value">
      <div class="valBox" v-if="item.type != 'slot'">
        <div class="input">
          <!-- 文本 -->
          <div class="text" v-if="item.isText">
            <div v-show="text">{{ text }}</div>
            <div v-show="!text">{{ value }}</div>
          </div>
          <!-- 输入框 -->
          <el-input
            v-model="value"
            :placeholder="item.placeholder"
            :disabled="item.isDisabled"
            v-if="item.type == 'input' && !item.isText"
            @change="change"
          />
          <!-- 文本域 -->
          <el-input
            v-model="value"
            type="textarea"
            :placeholder="item.placeholder"
            :disabled="item.isDisabled"
            v-if="item.type == 'textarea' && !item.isText"
            @change="change"
          />
          <!-- 数字输入框 -->
          <el-input
            v-model="value"
            type="number"
            :placeholder="item.placeholder"
            :disabled="item.isDisabled"
            v-if="item.type == 'inputNumber' && !item.isText"
            @change="change"
          />
          <!-- 下拉框 -->
          <el-select
            v-model="value"
            :placeholder="item.placeholder"
            v-if="item.type == 'select' && !item.isText"
            :disabled="item.isDisabled"
            @change="change"
          >
            <el-option
              v-for="(it, index) in item.options"
              :key="index"
              :label="it.label"
              :value="it.value"
            />
          </el-select>
          <!-- 多选下拉框 -->
          <el-select
            v-model="value"
            :placeholder="item.placeholder"
            v-if="item.type == 'selectMultiple' && !item.isText"
            :disabled="item.isDisabled"
            @change="change"
            multiple
            collapse-tags
            collapse-tags-tooltip
          >
            <el-option
              v-for="(it, index) in item.options"
              :key="index"
              :label="it.label"
              :value="it.value"
            />
          </el-select>
          <!-- 单选框 -->
          <el-radio-group
            v-model="value"
            v-if="item.type == 'radio' && !item.isText"
            :disabled="item.isDisabled"
            @change="change"
          >
            <el-radio
              v-for="(it, index) in item.options"
              :key="index"
              :label="it.label"
              :value="it.value"
            />
          </el-radio-group>
          <!-- 多选框 -->
          <el-checkbox-group
            v-model="value"
            v-if="item.type == 'checkbox' && !item.isText"
            :disabled="item.isDisabled"
            @change="change"
          >
            <el-checkbox
              v-for="(it, index) in item.options"
              :key="index"
              :label="it.label"
              :value="it.value"
            />
          </el-checkbox-group>
          <!-- 日期 -->
          <el-date-picker
            v-model="value"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            v-if="item.type == 'date' && !item.isText"
            :disabled="item.isDisabled"
            @change="change"
          />
          <!-- 日期范围 -->
          <el-date-picker
            v-model="value"
            type="daterange"
            range-separator="至"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-if="item.type == 'daterange' && !item.isText"
            :disabled="item.isDisabled"
            @change="change"
          />
          <!-- 日期时间 -->
          <el-date-picker
            v-model="value"
            type="datetime"
            placeholder="选择日期时间"
            v-if="item.type == 'datetime' && !item.isText"
            :disabled="item.isDisabled"
            value-format="YYYY-MM-DD hh:mm:ss"
            @change="change"
          />
          <!-- 日期时间范围 -->
          <el-date-picker
            v-model="value"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期时间"
            end-placeholder="结束日期时间"
            value-format="YYYY-MM-DD hh:mm:ss"
            v-if="item.type == 'datetimerange' && !item.isText"
            :disabled="item.isDisabled"
            @change="change"
          />
        </div>
        <div class="rightText" v-if="item.rightText">
          {{ item.rightText }}
        </div>
      </div>
      <slot v-else></slot>
      <div class="tipBox" v-if="item.tipText">
        {{ item.tipText }}
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.item {
  display: flex;
}
.label {
  height: 20px;
  width: 100px;
  line-height: 20px;
  margin-right: 6px;
  text-align: right;
  margin-top: 6px;
  flex-shrink: 0;
  font-size: 14px;
  color: var(--c-text);
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
      .text {
        height: 30px;
        padding: 0 6px;
        line-height: 30px;
        color: var(--c-text);
        border-bottom: 1px solid var(--c-border);
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        &::-webkit-scrollbar {
          width: 2px;
          height: 2px;
        }
      }
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
</style>
