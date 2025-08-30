<template>
  <div class="pa_page" v-loading="isLoading">
    <template v-if="!isLoading">
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
    </template>
  </div>
</template>
<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import { RouterView, useRouter, useRoute } from "vue-router";
import PIcon from "@Pcomponents/base/p-icon/index.vue";
import AdminTop from "@/components/layout/top.vue";
import AdminTopMobile from "@/components/layout/topMobile.vue";
import AdminNav from "@/components/layout/nav.vue";
import history from "@/components/layout/history.vue";
import useSharedStore from "@Passets/stores/shared";
import { useAppsStore } from "@/stores/apps";
import { bus } from "wujie";
import request from "@Passets/utils/request";

const sharedStore = useSharedStore();
const appsStore = useAppsStore();
const router = useRouter();
const route = useRoute();
const isFreeLogin =
  import.meta.env.DEV && import.meta.env.PUBLIC_FREE_LOGIN === "T";
const isFull = computed(() => {
  return sharedStore.isFull;
});
const isMobile = computed(() => {
  return window.innerWidth <= 700;
});
// 白名单
const whiteList = ["/login", "/404", "/403"];
const isLoading = ref(true);
onBeforeMount(async () => {
  if (isFreeLogin || whiteList.includes(route.path)) {
    return;
  }
  if (!localStorage.getItem("p_token")) {
    return router.push({ path: "/login" });
  }
  if (!sharedStore.userInfo) {
    await getUserInfo();
  }
  await getAppList();
  if (route.meta?.appKey) {
    const isOk = await appsStore.setAppId({ key: route.meta.appKey });
    if (!isOk || !appsStore.hasAppNav(route.query)) {
      ElMessage.error("无权限访问");
      return router.push({ path: "/403" });
    }
  }
  isLoading.value = false;
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
  } catch (error) {
    console.error(error);
    router.push({ path: "/login" });
    return false;
  }
};
const getAppList = async () => {
  const res = await request.get({
    url: "/main/getMyAppList",
  });
  if (res.code != 200 || !res.data) {
    ElMessage.error(res.msg || "获取应用列表失败");
    return false;
  }
  appsStore.setApps(res.data);
};
router.beforeEach((to, from, next) => {
  if (isFreeLogin || whiteList.includes(to.path)) {
    return next();
  }
  if (!localStorage.getItem("p_token")) {
    return next({ path: "/login" });
  }
  if (to.meta?.appKey && !appsStore.hasAppNav(to.query)) {
    ElMessage.error("无权限访问");
    return next({ path: "/403" });
  }
  next();
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
