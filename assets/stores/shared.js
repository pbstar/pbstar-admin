import { ref } from "vue";
import { defineStore } from "pinia";
export default defineStore("shared", () => {
  const info = ref(null);
  const isLogin = ref(false);
  const isDark = ref(false);
  const dialogIndex = ref(1000);
  const isFull = ref(false);
  const getIndex = () => {
    dialogIndex.value += 2;
    return dialogIndex.value;
  };
  return { isLogin, info, isDark, isFull, getIndex };
});
