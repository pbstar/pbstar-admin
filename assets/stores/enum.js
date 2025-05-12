import { ref } from "vue";
import { defineStore } from "pinia";
import request from "@Passets/utils/request";

export const useEnumStore = defineStore("enum", () => {
  const enums = ref({});
  const getEnum = async (enumKey) => {
    const result = {};
    const types = enumKey.split(",");
    const cachedTypes = types.filter((type) => enums.value[type]);
    if (cachedTypes.length === types.length) {
      types.forEach((type) => {
        result[type] = enums.value[type];
      });
    } else {
      // 接口获取服务端枚举
      const str = types.filter((type) => !enums.value[type]).join(",");
      const res = await request.get({
        base: "base",
        url: "/main/getEnum",
        data: { enumKey: str },
      });
      if (res.code === 200 && res.data) {
        for (const key in res.data) {
          if (res.data.hasOwnProperty(key)) {
            enums.value[key] = res.data[key];
            result[key] = res.data[key];
          }
        }
      }
    }
    return result;
  };

  return {
    enums,
    getEnum,
  };
});
