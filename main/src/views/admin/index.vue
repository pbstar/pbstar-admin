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
            <el-icon><Close /></el-icon>
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
import { computed } from "vue";
import { ElMessage } from "element-plus";
import { RouterView, useRouter, useRoute } from "vue-router";
import { Close } from "@element-plus/icons-vue";
import AdminTop from "@/components/layout/top.vue";
import AdminTopMobile from "@/components/layout/topMobile.vue";
import AdminNav from "@/components/layout/nav.vue";
import history from "@/components/layout/history.vue";
import useSharedStore from "@Passets/stores/shared";
import { useNavsStore } from "@/stores/navs";
import WujieVue from "wujie-vue3";
import request from "@Passets/utils/request";
const { bus } = WujieVue;
const sharedStore = useSharedStore();
const navsStore = useNavsStore();
const router = useRouter();
const route = useRoute();
const isFull = computed(() => {
  return sharedStore.isFull;
});
const isMobile = computed(() => {
  return window.innerWidth <= 700;
});
// 白名单
const whiteList = ["/login", "/admin/pUser", "/404", "/403"];
const toUnFull = () => {
  sharedStore.isFull = false;
  bus.$emit("changeSharedPinia", { isFull: false });
};
if (!sharedStore.userInfo) {
  request
    .post({
      base: "base",
      url: "/main/loginByToken",
    })
    .then((res) => {
      if (res.code == 200 && res.data) {
        localStorage.setItem("p_token", res.data.token);
        sharedStore.userInfo = {
          id: res.data.id,
          name: res.data.name,
          avatar: res.data.avatar,
          username: res.data.username,
          role: res.data.role,
        };
        request
          .get({
            base: "base",
            url: "/main/getMyNavTreeList",
          })
          .then((r) => {
            if (r.code === 200) {
              navsStore.setNavs(r.data);
              if (
                !whiteList.includes(route.fullPath) &&
                !navsStore.hasNav(route.fullPath)
              ) {
                ElMessage.error("无权限访问");
                router.push({ path: "/403" });
                return false;
              }
            } else {
              ElMessage.error(r.msg);
            }
          });
      } else {
        ElMessage.error(res.msg);
        localStorage.removeItem("p_token");
        router.push({ path: "/login" });
      }
    })
    .catch((err) => {
      localStorage.removeItem("p_token");
      router.push({ path: "/login" });
    });
}
router.beforeEach((to, from, next) => {
  if (whiteList.includes(to.path)) {
    next();
  } else {
    if (!localStorage.getItem("p_token")) {
      next({ path: "/login" });
      return false;
    }
    if (!navsStore.hasNav(to.fullPath)) {
      ElMessage.error("无权限访问");
      next({ path: "/403" });
      return false;
    }
    next();
  }
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
