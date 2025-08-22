import { ref } from "vue";
import { defineStore } from "pinia";
import request from "@Passets/utils/request";

/**
 * 枚举数据store
 */
export const useEnumStore = defineStore("enum", () => {
  const enumCache = ref({});

  /**
   * 获取枚举数据
   * @param {string} enumKeys 逗号分隔的枚举key
   * @returns {Promise<Object>} 枚举数据对象
   */
  const getEnum = async (enumKeys) => {
    const keys = enumKeys.split(",");
    const result = {};

    // 从缓存获取已有枚举
    const cachedKeys = keys.filter((key) => enumCache.value[key]);
    cachedKeys.forEach((key) => {
      result[key] = enumCache.value[key];
    });

    // 获取缺失的枚举
    const missingKeys = keys.filter((key) => !enumCache.value[key]);
    if (missingKeys.length > 0) {
      const res = await request.get({
        url: "/main/getEnum",
        data: { enumKey: missingKeys.join(",") },
      });

      if (res.code === 200 && res.data) {
        Object.assign(enumCache.value, res.data);
        Object.assign(result, res.data);
      }
    }

    return result;
  };

  return {
    enums: enumCache,
    getEnum,
  };
});
