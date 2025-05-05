import { ref } from "vue";
import { defineStore } from "pinia";
import request from "@Passets/utils/request";

export const useEnumStore = defineStore("enum", () => {
  const enums = ref({
    p_boolean: [
      { value: "1", label: "是" },
      { value: "2", label: "否" },
    ],
  });
  const getEnum = async (enumType) => {
    const result = {};
    const types = enumType.split(",");
    const cachedTypes = types.filter((type) => enums.value[type]);
    if (cachedTypes.length === types.length) {
      types.forEach((type) => {
        result[type] = enums.value[type];
      });
    } else {
      // 接口获取服务端枚举
      const res = await request.get({
        base: "base",
        url: "/base/getNavTreeList",
      });
      if (res.code === 200) {
        result["p_boolean1"] = [{ value: "1", label: "是" }, { value: "2", label: "否" }]
      }
    }
    return result;
  };

  return {
    enums,
    getEnum,
  };
});
