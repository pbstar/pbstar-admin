import { ref } from "vue";
import { defineStore } from "pinia";
import http from "@utils/http";

export default defineStore("user", () => {
  let info = ref(null);
  const menuList = ref([]);

  function getInfo() {
    return info.value;
  }
  function changeInfo(e) {
    info.value = e;
  }
  function getMenuList() {
    return new Promise((resolve) => {
      if (menuList.value.length) {
        resolve(menuList.value);
        return;
      }
      http.get("/api/getMenuList").then((res) => {
        if (res.code === 200) {
          menuList.value = res.data || [];
          resolve(menuList.value);
        }
      });
    });
  }
  return { getInfo, changeInfo, getMenuList };
});
