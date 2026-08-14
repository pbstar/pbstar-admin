<script setup lang="ts">
import useSharedStore from "@Passets/stores/shared";
import { bus } from "wujie";
import { pIcon } from "@Pcomponents";
import AppSelect from "../more/appSelect.vue";
import ThemeSwitch from "./ThemeSwitch.vue";
import { useUserHeader } from "./useUserHeader";

withDefaults(
  defineProps<{
    isMobile?: boolean;
    isCollapse?: boolean;
  }>(),
  {
    isMobile: false,
    isCollapse: false,
  },
);

defineEmits<{
  (e: "toggle-nav"): void;
}>();

const sharedStore = useSharedStore();

// 进入全屏
const toFull = () => {
  sharedStore.isFull = true;
  bus.$emit("changeSharedPinia", { isFull: true });
};

const { title, userName, userImg, toUserInfo, toLoginOut } = useUserHeader();
</script>

<template>
  <div class="box">
    <div class="left">
      <!-- 宽屏时折叠/展开侧边栏，窄屏时打开菜单抽屉，图标随对应状态切换 -->
      <div class="navBtn" @click="$emit('toggle-nav')">
        <p-icon
          :name="isMobile ? 'el-icon-menu' : isCollapse ? 'el-icon-expand' : 'el-icon-fold'"
        />
      </div>
      <img src="@/assets/imgs/logo-w.png" alt="" class="logo" />
      <div class="title">{{ title }}</div>
    </div>
    <div class="right">
      <app-select class="appSelect" />
      <p-icon class="full" name="el-icon-full-screen" @click="toFull" />
      <ThemeSwitch />
      <div class="user">
        <el-dropdown trigger="click">
          <div class="userBox">
            <img v-if="userImg" :src="userImg" alt="" />
            <img v-else src="@/assets/imgs/user.png" alt="" />
            <span class="userName">{{ userName }}</span>
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
    min-width: 0;

    .navBtn {
      width: 40px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      flex-shrink: 0;
    }

    .logo {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      flex-shrink: 0;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      margin-left: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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

  @media (max-width: 700px) {
    .left {
      .logo {
        width: 30px;
        height: 30px;
        margin-left: 0;
      }
      .title {
        font-size: 16px;
        max-width: 120px;
      }
    }
    .right {
      padding-right: 10px;
      .appSelect {
        margin-right: 10px;
        width: auto;
      }
      .full {
        display: none;
      }
      .user .userBox {
        margin-left: 10px;
        .userName {
          display: none;
        }
      }
    }
  }
}
</style>
