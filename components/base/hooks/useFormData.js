import { ref, watch } from "vue";

/**
 * 表单数据处理组合式函数
 * 提供表单数据的通用处理方法
 */
export function useFormData(props, emit) {
  const data = ref(props.data || []);
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
      const index = data.value.findIndex((it) => it.key === item.key);
      if (index > -1) {
        data.value[index] = { ...data.value[index], ...item };
      }
    });
  };

  /**
   * 更新表单值
   * @param {Object} obj - 需要更新的值对象
   */
  const updateValue = (obj) => {
    if (obj && typeof obj === "object") {
      valueObj.value = { ...valueObj.value, ...obj };
    }
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
      data.value = newData || [];
    },
    { immediate: true },
  );

  return {
    data,
    valueObj,
    updateData,
    updateValue,
    resetValue,
  };
}
