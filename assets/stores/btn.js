import { ref } from "vue";
import { defineStore } from "pinia";

/**
 * 按钮权限store
 */
export const useBtnStore = defineStore("btn", () => {
  const buttons = ref([
    {
      page: "列表",
      btns: [{ key: "list_add", name: "新增" }],
    },
  ]);

  // 获取扁平化按钮列表
  const getBtnList = () => {
    return buttons.value.flatMap((page, index) => [
      {
        label: page.page,
        value: index + 1,
        parentId: null,
      },
      ...page.btns.map((btn) => ({
        label: btn.name,
        value: btn.key,
        parentId: index + 1,
      })),
    ]);
  };

  // 检查按钮key唯一性
  const checkUniqueKeys = () => {
    const keys = new Set();
    for (const page of buttons.value) {
      for (const btn of page.btns) {
        if (keys.has(btn.key)) {
          throw new Error(`按钮key重复：${btn.key}`);
        }
        keys.add(btn.key);
      }
    }
  };

  checkUniqueKeys();

  return { getBtnList };
});
