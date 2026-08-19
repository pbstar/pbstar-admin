<script setup lang="ts">
import { pIcon } from "@Pcomponents";
import AppSelect from "../more/appSelect.vue";
import { useUserHeader } from "./useUserHeader";

const { title, userName, userImg, toUserInfo, toLoginOut } = useUserHeader();
</script>

<template>
  <div class="box">
    <div class="left">
      <img src="@/assets/imgs/logo-w.png" alt="" class="logo" />
      <div class="title">{{ title }}</div>
      <div class="divider"></div>
      <AppSelect class="appSelect" />
    </div>
    <div class="right">
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
  background-color: var(--c-bg-header);
  color: var(--c-text-theme);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: var(--space-4);

    .logo {
      width: 28px;
      height: 28px;
    }
    .title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      margin-left: var(--space-2);
      white-space: nowrap;
    }

    .divider {
      width: 1px;
      height: 20px;
      background: rgba(255, 255, 255, 0.16);
      margin: 0 var(--space-4);
    }
  }
  .right {
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: var(--space-5);
    .user {
      display: flex;
      align-items: center;
      .userBox {
        display: flex;
        align-items: center;
        color: var(--c-text-theme);
        cursor: pointer;
        img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          margin-right: var(--space-2);
        }
        .icon {
          margin-left: var(--space-2);
        }
      }
    }
  }
}
</style>
