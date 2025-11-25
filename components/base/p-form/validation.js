import { ElMessage } from "element-plus";

/**
 * 必填项校验
 * @param {Array} formData - 表单数据数组
 * @param {Object} values - 表单值对象
 * @returns {boolean} - 校验是否通过
 */
export const validateRequired = (formData, values) => {
  if (!Array.isArray(formData) || !values) {
    return true;
  }

  const errs = [];
  formData.forEach((item) => {
    if (item.isRequired) {
      const value = values[item.key];
      if (!value && value !== 0 && value !== false) {
        errs.push(item.label);
      }
    }
  });

  if (errs.length > 0) {
    ElMessage.error(`${errs.join("、")}为必填项`);
    return false;
  }

  return true;
};
