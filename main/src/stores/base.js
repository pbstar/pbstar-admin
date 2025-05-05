import { ref } from "vue";
import { defineStore } from "pinia";

export const useBaseStore = defineStore("base", () => {
  const isFold = ref(0);
  function setIsFold(e) {
    isFold.value = e ? 1 : 2;
    localStorage.setItem("p_isFold", isFold.value);
  }
  function getIsFold() {
    if (isFold.value) {
      return isFold.value == 1;
    } else {
      const p_isFold = localStorage.getItem("p_isFold");
      isFold.value = p_isFold || 2;
      return isFold.value == 1;
    }
  }

  return { isFold, setIsFold, getIsFold };
});
