import { ref } from "vue";
import { defineStore } from "pinia";
export default defineStore("shared", () => {
  const info = ref(null);
  const menuList = ref([]);
  const isLogin = ref(false);
  const isDark = ref(false);
  return { isLogin, info, menuList, isDark };
});
