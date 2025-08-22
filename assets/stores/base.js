import { ref } from "vue";
import { defineStore } from "pinia";

/**
 * 表格设置store
 */
export const useTableStore = defineStore("table", () => {
  const settings = ref({});

  // 从本地存储加载设置
  const loadSettings = () => {
    const saved = localStorage.getItem("p_tableSetting");
    if (saved) settings.value = JSON.parse(saved);
  };

  // 更新设置
  const updateSetting = (key, value) => {
    settings.value[key] = value;
    localStorage.setItem("p_tableSetting", JSON.stringify(settings.value));
  };

  // 获取设置
  const getSetting = (key) => {
    if (!settings.value[key]) loadSettings();
    return settings.value[key] || null;
  };

  // 删除设置
  const removeSetting = (key) => {
    delete settings.value[key];
    localStorage.setItem("p_tableSetting", JSON.stringify(settings.value));
  };

  return {
    settings,
    updateSetting,
    getSetting,
    removeSetting,
  };
});
