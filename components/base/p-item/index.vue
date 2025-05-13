<script setup>
import { ref, watch } from "vue";
import { useEnumStore } from "@Passets/stores/enum";
const enumStore = useEnumStore();
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
const getPlaceholder = (config) => {
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
  return placeholderMap[config.type] || "";
};
const config = ref({
  key: "",
  label: "",
  type: "input",
  placeholder: getPlaceholder(props.config),
  isText: false,
  isRequired: false,
  isDisabled: false,
  options: [],
  labelStyle: "",
  enumKey: "",
  tipText: "",
  rightText: "",
});
const value = ref("");
const text = ref("");
const selectTreeData = ref([]); //树形结构数据
const changeText = (arr) => {
  let obj = arr.find((it) => it.value == value.value);
  if (obj) {
    text.value = obj.label;
  } else {
    text.value = "";
  }
};
const toTree = (arr) => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    return [];
  }
  const tree = [];
  const map = new Map();
  arr.forEach((item) => map.set(item.id, { ...item }));
  arr.forEach((item) => {
    const parent = map.get(item.parentId);
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(map.get(item.id));
    } else {
      tree.push(map.get(item.id));
    }
  });
  return tree;
};

watch(
  () => props.modelValue,
  (newVal) => {
    value.value = newVal;
    if (
      config.value.isText &&
      config.value.options &&
      config.value.options.length > 0
    ) {
      changeText(config.value.options);
    }
  },
  {
    immediate: true,
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
watch(
  () => config.value.enumKey,
  (newVal) => {
    if (newVal) {
      enumStore.getEnum(config.value.enumKey).then((res) => {
        if (res) {
          let list = res[config.value.enumKey];
          config.value.options = list;
          if (config.value.isText) {
            changeText(config.value.options);
          }
        }
      });
    }
  },
  {
    immediate: true,
  },
);
watch(
  () => config.value.options,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      if (config.value.isText) {
        changeText(newVal);
      }
      if (config.value.type == "selectTree") {
        selectTreeData.value = toTree(newVal);
      }
    }
  },
  {
    immediate: true,
    deep: true,
  },
);
const change = (val) => {
  const obj = {
    value: val,
  };
  if (config.value.key) {
    obj.key = config.value.key;
  }
  if (config.value.options && config.value.options.length > 0) {
    const row = config.value.options.find((it) => it.value == value.value);
    if (row) {
      obj.row = row;
    }
  }
  emit("update:modelValue", value.value);
  emit("change", obj);
};
</script>
<template>
  <div class="item">
    <div class="label" v-if="config.label" :style="config.labelStyle">
      <span
        v-show="config.isRequired && !config.isText && !config.isDisabled"
        style="color: red"
        >*</span
      >
      <span>{{ config.label }}</span>
    </div>
    <div class="value">
      <div class="valBox" v-if="config.type != 'slot'">
        <div class="input">
          <!-- 文本 -->
          <div class="text" v-if="config.isText">
            <div v-show="text">{{ text }}</div>
            <div v-show="!text">{{ value }}</div>
          </div>
          <!-- 输入框 -->
          <el-input
            v-model="value"
            :placeholder="config.placeholder"
            :disabled="config.isDisabled"
            v-if="config.type == 'input' && !config.isText"
            @change="change"
          />
          <!-- 文本域 -->
          <el-input
            v-model="value"
            type="textarea"
            :placeholder="config.placeholder"
            :disabled="config.isDisabled"
            v-if="config.type == 'textarea' && !config.isText"
            @change="change"
          />
          <!-- 数字输入框 -->
          <el-input
            v-model="value"
            type="number"
            :placeholder="config.placeholder"
            :disabled="config.isDisabled"
            v-if="config.type == 'inputNumber' && !config.isText"
            @change="change"
          />
          <!-- 下拉框 -->
          <el-select
            v-model="value"
            :placeholder="config.placeholder"
            v-if="config.type == 'select' && !config.isText"
            :disabled="config.isDisabled"
            @change="change"
          >
            <el-option
              v-for="(it, index) in config.options"
              :key="index"
              :label="it.label"
              :value="it.value"
            />
          </el-select>
          <!-- 多选下拉框 -->
          <el-select
            v-model="value"
            :placeholder="config.placeholder"
            v-if="config.type == 'selectMultiple' && !config.isText"
            :disabled="config.isDisabled"
            @change="change"
            multiple
            collapse-tags
            collapse-tags-tooltip
          >
            <el-option
              v-for="(it, index) in config.options"
              :key="index"
              :label="it.label"
              :value="it.value"
            />
          </el-select>
          <!-- 树形下拉框 -->
          <el-tree-select
            v-model="value"
            :placeholder="config.placeholder"
            v-if="config.type == 'selectTree' && !config.isText"
            :disabled="config.isDisabled"
            @change="change"
            :data="selectTreeData"
            check-strictly
            :render-after-expand="false"
          />
          <!-- 单选框 -->
          <el-radio-group
            v-model="value"
            v-if="config.type == 'radio' && !config.isText"
            :disabled="config.isDisabled"
            @change="change"
          >
            <el-radio
              v-for="(it, index) in config.options"
              :key="index"
              :label="it.label"
              :value="it.value"
            />
          </el-radio-group>
          <!-- 多选框 -->
          <el-checkbox-group
            v-model="value"
            v-if="config.type == 'checkbox' && !config.isText"
            :disabled="config.isDisabled"
            @change="change"
          >
            <el-checkbox
              v-for="(it, index) in config.options"
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
            v-if="config.type == 'date' && !config.isText"
            :disabled="config.isDisabled"
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
            v-if="config.type == 'daterange' && !config.isText"
            :disabled="config.isDisabled"
            @change="change"
          />
          <!-- 日期时间 -->
          <el-date-picker
            v-model="value"
            type="datetime"
            placeholder="选择日期时间"
            v-if="config.type == 'datetime' && !config.isText"
            :disabled="config.isDisabled"
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
            v-if="config.type == 'datetimerange' && !config.isText"
            :disabled="config.isDisabled"
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
