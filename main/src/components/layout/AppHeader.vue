<script setup lang="ts">
import { pIcon } from "@Pcomponents";
import AppSelect from "../more/appSelect.vue";
import ThemeSwitch from "./ThemeSwitch.vue";
import { useUserHeader } from "./useUserHeader";

const { title, userName, userImg, toUserInfo, toLoginOut } = useUserHeader();
</script>

<template>
  <div class="box">
    <div class="left">
      <AppSelect class="appSelect" />
      <img src="@/assets/imgs/logo-w.png" alt="" class="logo" />
      <div class="title">{{ title }}</div>
    </div>
    <div class="right">
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
    padding-left: 12px;

    .appSelect {
      margin-right: 12px;
    }

    .logo {
      width: 32px;
      height: 32px;
      border-radius: 8px;
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
