<script setup>
import { ref, watch } from "vue";
import useSharedStore from "@Passets/stores/shared";
import { useRouter } from "vue-router";
import { bus } from "wujie";
import request from "@Passets/utils/request";
import { pIcon } from "@Pcomponents";
import { changeTheme } from "@Passets/utils/theme";
import AppSelect from "../more/appSelect.vue";
import { useNavMenu } from "@/components/layout/layout";
import MenuTree from "./MenuTree.vue";

const sharedStore = useSharedStore();
const router = useRouter();

const { listTree, activeIndex, selectNav } = useNavMenu();

const title = ref(import.meta.env.PUBLIC_TITLE);
const userName = ref(sharedStore.userInfo?.name || "管理员");
const userImg = ref(sharedStore.userInfo?.avatar || "");
const theme = ref(false);
const isMore = ref(false);

const select = (val) => {
  selectNav(val);
  isMore.value = false;
};

const toUserInfo = () => {
  isMore.value = false;
  router.push({ path: "/admin/pUser" });
};

const themeChange = () => {
  changeTheme(theme.value);
  sharedStore.isDark = theme.value;
  bus.$emit("changeSharedPinia", { isDark: theme.value });
};

// 退出登录
const toLoginOut = () => {
  request.post({ url: "/main/logout" }).then((res) => {
    if (res.code === 200) {
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
      <img src="@/assets/imgs/logo-w.png" alt="" />
      <div class="title">{{ title }}</div>
    </div>
    <div class="right">
      <div class="btn">
        <p-icon
          name="el-icon-MoreFilled"
          v-show="!isMore"
          @click="isMore = true"
        />
        <p-icon
          name="el-icon-CloseBold"
          v-show="isMore"
          @click="isMore = false"
        />
      </div>
      <div class="content" v-show="isMore">
        <app-select class="appSelect" />
        <MenuTree
          :menuList="listTree"
          :activeIndex="activeIndex"
          @select="select"
        />
        <div class="mobile-controls">
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
          <div class="userBox" @click="toUserInfo">
            <img v-if="userImg" :src="userImg" alt="" />
            <img v-else src="@/assets/imgs/user.png" alt="" />
            {{ userName }}
          </div>
          <el-button style="width: 90%" @click="toLoginOut"> 退出 </el-button>
        </div>
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
      width: 30px;
      height: 30px;
      border-radius: 8px;
      margin-left: 10px;
    }
    .title {
      font-size: 18px;
      font-weight: bold;
      margin-left: 6px;
    }
  }
  .right {
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: 10px;
    .btn {
      font-size: 22px;
      display: flex;
      align-items: center;
    }
    .content {
      width: 100vw;
      height: calc(100vh - 46px);
      background-color: var(--c-bg);
      position: fixed;
      top: 46px;
      left: 0;
      z-index: 100;
      overflow-y: auto;
      padding: 20px;
      .appSelect {
        margin-bottom: 20px;
      }

      .mobile-controls {
        margin-top: 30px;
        padding: 20px 0;
        border-top: 1px solid var(--c-border);
        display: flex;
        flex-direction: column;
        gap: 24px;
        align-items: center;

        .el-switch {
          transform: scale(1.2);
        }

        .userBox {
          display: flex;
          align-items: center;
          color: var(--c-text);
          cursor: pointer;
          font-size: 16px;

          img {
            margin-right: 12px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>
