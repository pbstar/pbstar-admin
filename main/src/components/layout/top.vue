<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import useSharedStore from "@Passets/stores/shared";
import { bus } from "wujie";
import request from "@Passets/utils/request";
import { PIcon } from "@Pcomponents";
import AppSelect from "../more/appSelect.vue";
import { changeTheme } from "@Passets/utils/theme";

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
  changeTheme(theme.value);
  sharedStore.isDark = theme.value;
  bus.$emit("changeSharedPinia", { isDark: theme.value });
};

const toFull = () => {
  sharedStore.isFull = true;
  bus.$emit("changeSharedPinia", { isFull: true });
};

const toLoginOut = () => {
  request.post({ url: "/main/logout" }).then((res) => {
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
  (newVal) => {
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
      <img src="@/assets/imgs/logo-w.png" alt="" class="logo" />
      <div class="title">{{ title }}</div>
    </div>
    <div class="right">
      <app-select class="appSelect" />
      <p-icon class="full" name="el-icon-full-screen" @click="toFull" />
      <el-switch
        v-model="theme"
        inline-prompt
        active-text="深色"
        inactive-text="浅色"
        style="
          border-color: #fff;
          --el-switch-on-color: #2c384d;
          --el-switch-off-color: #2165c9;
        "
        @change="themeChange"
      >
        <template #active-action>
          <p-icon name="el-icon-moon" />
        </template>
        <template #inactive-action>
          <p-icon name="el-icon-sunny" />
        </template>
      </el-switch>
      <div class="user">
        <el-dropdown trigger="click">
          <div class="userBox">
            <img v-if="userImg" :src="userImg" alt="" />
            <img v-else src="@/assets/imgs/user.png" alt="" />
            {{ userName }}
            <p-icon class="icon" name="el-icon-caret-bottom" />
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
  align-items: center;

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
    .appSelect {
      margin-right: 20px;
    }
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
