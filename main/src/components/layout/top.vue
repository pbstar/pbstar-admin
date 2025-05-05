<script setup>
import { ref } from "vue";
import { CaretBottom, Setting, Moon, Sunny } from "@element-plus/icons-vue";
import useSharedStore from "@Passets/stores/shared";
import WujieVue from "wujie-vue3";
const { bus } = WujieVue;
const sharedStore = useSharedStore();

const title = ref(import.meta.env.PUBLIC_TITLE);
const userName = ref("管理员");
const userImg = ref("");
const theme = ref(false);
const toUserInfo = () => {
  sharedStore.isLogin = true;
  bus.$emit("changeSharedPinia", { isLogin: true });
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
</script>
<template>
  <div class="box">
    <div class="left">
      <img src="@/assets/imgs/logo-w.png" alt="" />
      <div class="title">{{ title }}</div>
    </div>
    <div class="right">
      <el-switch
        v-model="theme"
        inline-prompt
        active-text="深色"
        inactive-text="浅色"
        :active-action-icon="Moon"
        :inactive-action-icon="Sunny"
        style="
          margin-left: 10px;
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
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <el-icon class="setting"><Setting /></el-icon>
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
          margin-right: 8px;
        }
        .icon {
          margin-left: 8px;
        }
      }
    }
    .setting {
      cursor: pointer;
      font-size: 20px;
      margin-left: 20px;
    }
  }
}
</style>
