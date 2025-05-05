import { ref } from "vue";
import { defineStore } from "pinia";

export const useTableStore = defineStore("table", () => {
  const setting = ref({});
  function changeSetting(tableKey, value) {
    setting.value[tableKey] = value;
    localStorage.setItem("p_tableSetting", JSON.stringify(setting.value));
  }
  function getSetting(tableKey) {
    if (!setting.value[tableKey]) {
      const tableSetting = localStorage.getItem("p_tableSetting");
      if (tableSetting) {
        setting.value = JSON.parse(tableSetting);
      }
    }
    return setting.value[tableKey] || null;
  }
  function removeSetting(tableKey) {
    delete setting.value[tableKey];
    localStorage.setItem("p_tableSetting", JSON.stringify(setting.value));
  }
  return {
    setting,
    changeSetting,
    getSetting,
    removeSetting,
  };
});
