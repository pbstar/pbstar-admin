import { ref, watch, computed } from "vue";
import { useEnumStore } from "@Passets/stores/enum";

/**
 * 表单项通用组合式函数
 * 提取了所有表单组件的公共逻辑
 */
export function useFormItem(props, emits, options = {}) {
  const {
    handleArray = false,
    handleOptions = false,
    handleTree = false,
    structureFn = null,
  } = options;

  const enumStore = useEnumStore();

  // 值处理
  const value = ref(handleArray ? props.modelValue || [] : props.modelValue);
  const optionsData = ref(props.config.options || []);

  // 值变更处理
  const handleChange = (val) => {
    emits("update:modelValue", value.value);
    emits("change", val);
  };

  // 工具函数:查找选项标签
  const findOptionLabel = (val) => {
    const option = optionsData.value.find((item) => item.value === val);
    return option ? option.label : val;
  };

  // 计算属性
  const getLabel = computed(() => {
    if (!handleOptions || !value.value) return value.value;

    if (handleArray || Array.isArray(value.value)) {
      return value.value.map(findOptionLabel).join(",");
    }

    return findOptionLabel(value.value);
  });

  const getRangeLabel = computed(() =>
    value.value?.length > 0 ? value.value.join("-") : "",
  );

  // 数据加载
  const loadOptions = async (enumKey) => {
    if (!enumKey) return;

    const res = await enumStore.getEnum(enumKey);
    if (res?.[enumKey]) {
      const list = res[enumKey];
      optionsData.value =
        handleTree && structureFn
          ? structureFn(list, "parentId", "value")
          : list;
    }
  };

  // 监听modelValue变化
  watch(
    () => props.modelValue,
    (newVal) => {
      value.value = handleArray ? newVal || [] : newVal;
    },
  );

  if (handleOptions) {
    // 监听options变化
    watch(
      () => props.config.options,
      (newVal) => {
        optionsData.value = handleArray ? newVal || [] : newVal;
      },
      { deep: true },
    );

    watch(() => props.config.enumKey, loadOptions, { immediate: true });
  }

  // 监听tree options变化
  if (handleTree && structureFn) {
    watch(
      () => props.config.options,
      (newVal) => {
        optionsData.value = structureFn(newVal, "parentId", "value");
      },
      { deep: true, immediate: true },
    );
  }

  return {
    value,
    options: optionsData,
    handleChange,
    getLabel,
    getRangeLabel,
  };
}

/**
 * 通用props定义
 */
export const commonProps = {
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: "",
  },
  config: {
    type: Object,
    default: () => ({}),
  },
};

/**
 * 通用emits定义
 */
export const commonEmits = ["update:modelValue", "change"];

/**
 * 通用text样式
 */
export const textStyles = {
  height: "30px",
  padding: "0 6px",
  lineHeight: "30px",
  color: "var(--c-text)",
  borderBottom: "1px solid var(--c-border)",
  overflowX: "auto",
  overflowY: "hidden",
  whiteSpace: "nowrap",
  "::webkit-scrollbar": {
    width: "2px",
    height: "2px",
  },
};

/**
 * 通用textBig样式
 */
export const textBigStyles = {
  height: "auto",
  padding: "5px 6px",
  lineHeight: "20px",
  color: "var(--c-text)",
  borderBottom: "1px solid var(--c-border)",
  wordBreak: "break-word",
};
