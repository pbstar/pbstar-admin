import { ref, watch } from "vue";

/**
 * 表单数据处理组合式函数
 * 提供表单数据的通用处理方法
 */
export function useFormData(props, emits) {
  const formData = ref(props.data || []);
  const valueObj = ref({});

  /**
   * 更新表单数据
   * @param {Array} list - 需要更新的数据列表
   */
  const updateData = (list) => {
    if (!Array.isArray(list)) {
      console.warn("updateData方法的参数必须是数组");
      return;
    }

    list.forEach((item) => {
      if (!item.key) {
        console.warn("updateData方法的数组参数中必须包含key");
        return;
      }
      const index = formData.value.findIndex((it) => it.key === item.key);
      if (index > -1) {
        formData.value[index] = { ...formData.value[index], ...item };
      }
    });
  };

  /**
   * 处理表单值变化
   * @param {Object} val - 表单值
   */
  const handleChange = (val) => {
    emits("change", val);
    emits("update:modelValue", valueObj.value);
  };

  /**
   * 重置表单值
   */
  const resetValue = () => {
    valueObj.value = {};
  };

  // 监听props.data变化
  watch(
    () => props.data,
    (newData) => {
      formData.value = newData || [];
    },
    { immediate: true },
  );

  watch(
    () => props.modelValue,
    (newVal) => (valueObj.value = { ...valueObj.value, ...newVal }),
    { immediate: true, deep: true },
  );

  return {
    formData,
    valueObj,
    updateData,
    resetValue,
    handleChange,
  };
}
