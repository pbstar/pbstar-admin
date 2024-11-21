<template>
  <div class="wrapper">
    <RouterLink to="/page1">page1</RouterLink>
    <RouterLink to="/page2">page2</RouterLink>
  </div>
  <RouterView />
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import WujieVue from "wujie-vue3";
const { bus } = WujieVue;
const router = useRouter();
const url = "/admin/app_template?template=";
router.afterEach((to, from) => {
  let path = encodeURIComponent(to.fullPath);
  bus.$emit("changeMenuValue", url + path);
});
onMounted(() => {
  bus.$on("changeRouter", (e) => {
    //判断字符串是否包含某个字符
    if (e.indexOf(url) > -1) {
      e = e.replace(url, "");
      e = decodeURIComponent(e);
      router.push(e);
    }
  });
});
onBeforeUnmount(() => {
  bus.$off("changeRouter", () => {});
});
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  margin-bottom: 20px;
}
</style>
