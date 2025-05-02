<script setup>
import { ref } from "vue";
import { CaretBottom, Setting } from "@element-plus/icons-vue";
import useSharedStore from "@Passets/stores/shared";
import WujieVue from "wujie-vue3";
const { bus } = WujieVue;
const sharedStore = useSharedStore();

const title = ref(import.meta.env.PUBLIC_TITLE);
const userName = ref("管理员");
const userImg = ref("");
const toUserInfo = () => {
  sharedStore.isLogin = true;
  bus.$emit("changeSharedPinia", { isLogin: true });
};
</script>
<template>
  <div class="box">
    <div class="left">
      <div class="title">{{ title }}</div>
    </div>
    <div class="right">
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
  background-color: #0d86ff;
  display: flex;
  justify-content: space-between;
  .left {
    height: 100%;
    display: flex;
    align-items: center;
    .title {
      font-size: 20px;
      font-weight: bold;
      margin-left: 20px;
      color: #fff;
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
        color: #fff;
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
      color: #fff;
      cursor: pointer;
      font-size: 20px;
      margin-left: 20px;
    }
  }
}
</style>
