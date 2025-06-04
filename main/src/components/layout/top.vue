<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { CaretBottom, FullScreen, Moon, Sunny } from "@element-plus/icons-vue";
import useSharedStore from "@Passets/stores/shared";
import WujieVue from "wujie-vue3";
import request from "@Passets/utils/request";
const { bus } = WujieVue;
const sharedStore = useSharedStore();
const router = useRouter();
const title = ref(import.meta.env.PUBLIC_TITLE);
const userName = ref(sharedStore.userInfo?.name || "管理员");
const userImg = ref(sharedStore.userInfo?.avatar || "");
const theme = ref(false);
const toUserInfo = () => {
  router.push({ path: "/admin/pUser" });
};
const themeChange = () => {
  if (theme.value) {
    sharedStore.isDark = true;
    bus.$emit("changeSharedPinia", { isDark: true });
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.classList.add("dark");
  } else {
    sharedStore.isDark = false;
    bus.$emit("changeSharedPinia", { isDark: false });
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.classList.remove("dark");
  }
};
const toFull = () => {
  sharedStore.isFull = true;
  bus.$emit("changeSharedPinia", { isFull: true });
};
const toLoginOut = () => {
  request
    .post({
      base: "base",
      url: "/main/logout",
    })
    .then((res) => {
      if (res.code == 200) {
        sharedStore.userInfo = null;
        localStorage.removeItem("p_token");
        bus.$emit("changeSharedPinia", { userInfo: null });
        router.push({ path: "/login" });
      }
    });
};
watch(
  () => sharedStore.userInfo,
  (newVal, oldVal) => {
    if (newVal) {
      userName.value = newVal.name || "管理员";
      userImg.value = newVal.avatar || "";
    }
  },
);
</script>
<template>
  <div class="box">
    <div class="left">
      <img src="@/assets/imgs/logo-w.png" alt="" />
      <div class="title">{{ title }}</div>
    </div>
    <div class="right">
      <el-icon class="full" @click="toFull"><FullScreen /></el-icon>
      <el-switch
        v-model="theme"
        inline-prompt
        active-text="深色"
        inactive-text="浅色"
        :active-action-icon="Moon"
        :inactive-action-icon="Sunny"
        style="
          border-color: #fff;
          --el-switch-on-color: #2c384d;
          --el-switch-off-color: #2165c9;
        "
        @change="themeChange"
      />
      <div class="user">
        <el-dropdown trigger="click">
          <div class="userBox">
            <img v-if="userImg" :src="userImg" alt="" />
            <img v-else src="@/assets/imgs/user.png" alt="" />
            {{ userName }}
            <el-icon class="icon"><CaretBottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toUserInfo">个人资料</el-dropdown-item>
              <el-dropdown-item @click="toLoginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  background-color: var(--c-bg-theme);
  color: var(--c-text-theme);
  display: flex;
  justify-content: space-between;
  .left {
    height: 100%;
    display: flex;
    align-items: center;
    img {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      margin-left: 10px;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      margin-left: 6px;
    }
  }
  .right {
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: 20px;
    .full {
      margin-right: 20px;
      font-size: 20px;
      cursor: pointer;
    }
    .user {
      display: flex;
      align-items: center;
      .userBox {
        margin-left: 20px;
        display: flex;
        align-items: center;
        color: var(--c-text-theme);
        cursor: pointer;
        img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 8px;
        }
        .icon {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
