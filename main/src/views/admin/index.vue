<template>
  <div class="pa_page">
    <div class="top" v-show="!isFull">
      <AdminTop v-show="!isMobile" />
      <AdminTopMobile v-show="isMobile" />
    </div>
    <div class="main">
      <div class="mLeft" v-show="!isFull && !isMobile">
        <AdminNav />
      </div>
      <div
        class="mRight"
        :style="{
          paddingLeft: isFull ? '0' : '10px',
          paddingRight: isFull ? '0' : '10px',
        }"
      >
        <history class="history" v-show="!isFull && !isMobile" />
        <div style="height: 0; width: 100%" v-show="isFull">
          <div class="unfull" @click="toUnFull">
            <p-icon name="el-icon-close" />
          </div>
        </div>
        <div style="width: 100%; height: 10px" v-show="isMobile"></div>
        <div class="mApp">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onBeforeMount, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { RouterView, useRouter, useRoute } from "vue-router";
import PIcon from "@Pcomponents/base/p-icon/index.vue";
import AdminTop from "@/components/layout/top.vue";
import AdminTopMobile from "@/components/layout/topMobile.vue";
import AdminNav from "@/components/layout/nav.vue";
import history from "@/components/layout/history.vue";
import useSharedStore from "@Passets/stores/shared";
import { useNavsStore } from "@/stores/navs";
import { bus } from "wujie";
import request from "@Passets/utils/request";

const sharedStore = useSharedStore();
const navsStore = useNavsStore();
const router = useRouter();
const route = useRoute();
const freeLogin = import.meta.env.PUBLIC_FREE_LOGIN;
const isFull = computed(() => {
  return sharedStore.isFull;
});
const isMobile = computed(() => {
  return window.innerWidth <= 700;
});
// 白名单
const whiteList = ["/login", "/admin/pUser", "/404", "/403"];
onBeforeMount(async () => {
  if (!sharedStore.userInfo && freeLogin !== "T") {
    await getUserInfo();
  }
});
const toUnFull = () => {
  sharedStore.isFull = false;
  bus.$emit("changeSharedPinia", { isFull: false });
};
const getUserInfo = async () => {
  try {
    const userRes = await request.post({
      url: "/main/loginByToken",
    });
    if (userRes.code != 200 || !userRes.data) {
      ElMessage.error(userRes.msg || "获取用户信息失败");
      localStorage.removeItem("p_token");
      router.push({ path: "/login" });
      return false;
    }
    localStorage.setItem("p_token", userRes.data.token);
    sharedStore.userInfo = {
      id: userRes.data.id,
      name: userRes.data.name,
      avatar: userRes.data.avatar,
      username: userRes.data.username,
      role: userRes.data.role,
      btns: userRes.data.btns,
    };
    bus.$emit("changeSharedPinia", { userInfo: sharedStore.userInfo });
    const navRes = await request.get({
      url: "/main/getMyNavTreeList",
    });
    if (navRes.code != 200 || !navRes.data) {
      ElMessage.error(navRes.msg || "获取导航失败");
      return false;
    }
    navsStore.setNavs(navRes.data);
    if (
      !whiteList.includes(route.fullPath) &&
      !navsStore.hasNav(route.fullPath)
    ) {
      ElMessage.error("无权限访问");
      router.push({ path: "/403" });
      return false;
    }
  } catch (error) {
    console.log(error);
    router.push({ path: "/login" });
    return false;
  }
};
router.beforeEach((to, from, next) => {
  if (freeLogin) {
    return next();
  }
  if (whiteList.includes(to.path)) {
    return next();
  }
  if (!localStorage.getItem("p_token")) {
    return next({ path: "/login" });
  }
  if (!navsStore.hasNav(to.fullPath)) {
    ElMessage.error("无权限访问");
    return next({ path: "/403" });
  }
  next();
});
bus.$on("changeSharedPinia", (e) => {});
onUnmounted(() => {
  bus.$off("changeSharedPinia");
});
</script>
<style scoped lang="scss">
.pa_page {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: var(--c-bg-box);
  overflow: hidden;

  .top {
    height: 50px;
    width: 100%;
    flex-shrink: 0;
  }

  .main {
    flex: 1;
    min-height: 0;
    display: flex;
    .mLeft {
      width: 200px;
      height: 100%;
      flex-shrink: 0;
    }
    .mRight {
      height: 100%;
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;

      .history {
        width: 100%;
        height: 40px;
        flex-shrink: 0;
      }
      .mApp {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .unfull {
        position: fixed;
        bottom: 100px;
        right: 30px;
        z-index: 2100;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--c-bg-theme);
        color: var(--c-text-theme);
        cursor: pointer;
        opacity: 0.8;
        //上下跳动动画
        animation: upDown 1s infinite;
      }
    }
  }
  @media screen and (max-width: 700px) {
    .top {
      height: 46px;
    }
  }
}
@keyframes upDown {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
