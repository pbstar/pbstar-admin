import { ref } from "vue";
import { defineStore } from "pinia";
import request from "@Passets/utils/request";

export default defineStore("user", () => {
  const info = ref(null);
  const menuList = ref([]);
  const isLogin = ref(false);

  function getInfo() {
    if (info.value) {
      return info.value;
    }
    const token = localStorage.getItem("token");
    const role_key = localStorage.getItem("role_key");
    const user_id = localStorage.getItem("user_id");
    const user_info = localStorage.getItem("user_info");
    if (token && role_key && user_id && user_info) {
      info.value = {
        token,
        role_key,
        user_id,
        user_info: JSON.parse(user_info),
      };
      return info.value;
    }
    return null;
  }
  function setInfo(e) {
    if (!e) {
      return;
    }
    isLogin.value = true;
    info.value = e;
    localStorage.setItem("token", e.token);
    localStorage.setItem("role_key", e.role_key);
    localStorage.setItem("user_id", e.user_id);
    localStorage.setItem("user_info", JSON.stringify(e.user_info));
  }
  setInfo(getInfo());
  function loginOut() {
    isLogin.value = false;
    menuList.value = [];
    info.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("role_key");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_info");
  }
  function getMyMenuList() {
    return new Promise((resolve) => {
      if (menuList.value.length) {
        resolve(menuList.value);
        return;
      }
      request.get("/api/getMyMenuList").then((res) => {
        if (res.code === 200) {
          menuList.value = res.data || [];
        }
        resolve(menuList.value);
      });
    });
  }
  return { isLogin, getInfo, setInfo, loginOut, getMyMenuList };
});
