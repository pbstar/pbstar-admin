import { ref } from "vue";
import { defineStore } from "pinia";

export const useBtnStore = defineStore("btn", () => {
  const btns = ref([
    {
      page: "列表",
      btns: [
        {
          key: "list_add",
          name: "新增",
        },
      ],
    },
  ]);
  // 获取按钮列表
  function getBtnList() {
    const arr = [];
    btns.value.forEach((item, index) => {
      arr.push({
        label: item.page,
        value: index + 1,
        parentId: null,
      });
      item.btns.forEach((btn) => {
        arr.push({
          label: btn.name,
          value: btn.key,
          parentId: index + 1,
        });
      });
    });
    return arr;
  }
  // 检查key唯一
  function checkKey() {
    const keys = [];
    btns.value.forEach((item) => {
      item.btns.forEach((btn) => {
        if (keys.includes(btn.key)) {
          throw new Error(`key重复：${btn.key}`);
        }
        keys.push(btn.key);
      });
    });
  }
  checkKey();
  return {
    getBtnList,
  };
});
