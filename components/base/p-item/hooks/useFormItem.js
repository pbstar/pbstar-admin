import { ref, watch, computed } from "vue";
import { useEnumStore } from "@Passets/stores/enum";

/**
 * 表单项通用组合式函数
 * 提取了所有表单组件的公共逻辑
 */
export function useFormItem(props, emits, data = {}) {
  const {
    handleArray = false,
    handleOptions = false,
    handleTree = false,
    structureFn = null,
  } = data;

  const enumStore = useEnumStore();

  // 值处理
  const value = ref(handleArray ? props.modelValue || [] : props.modelValue);

  // 选项处理
  const options = ref(
    handleOptions ? props.config.options || [] : props.config.options,
  );

  // 值变更处理
  const handleChange = (val) => {
    emits("update:modelValue", value.value);
    emits("change", val);
  };

  // 标签显示计算
  const getLabel = computed(() => {
    if (!handleOptions) return value.value;

    if (handleArray || Array.isArray(value.value)) {
      if (!value.value || value.value.length === 0) return "";

      return value.value
        .map((it) => {
          const row = options.value.find((item) => item.value == it);
          return row ? row.label : it;
        })
        .join(",");
    } else {
      const row = options.value.find((it) => it.value == value.value);
      return row ? row.label : value.value;
    }
  });

  // 范围选择器标签显示
  const getRangeLabel = computed(() => {
    return value.value && value.value.length > 0 ? value.value.join("-") : "";
  });

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
        options.value = handleArray ? newVal || [] : newVal;
      },
      { deep: true },
    );
    // 监听enumKey变化
    watch(
      () => props.config.enumKey,
      (newVal) => {
        if (!newVal) return;

        enumStore.getEnum(newVal).then((res) => {
          if (res && res[newVal]) {
            const list = res[newVal];
            options.value =
              handleTree && structureFn
                ? structureFn(list, "parentId", "value")
                : list;
          }
        });
      },
      { immediate: true },
    );
  }

  // 监听tree options变化
  if (handleTree && structureFn) {
    watch(
      () => props.config.options,
      (newVal) => {
        options.value = structureFn(newVal, "parentId", "value");
      },
      { deep: true, immediate: true },
    );
  }

  return {
    value,
    options,
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
