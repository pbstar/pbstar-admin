<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { Moon, Sunny, MoreFilled, CloseBold } from "@element-plus/icons-vue";
import useSharedStore from "@Passets/stores/shared";
import { useNavsStore } from "@/stores/navs";
import WujieVue from "wujie-vue3";
import request from "@Passets/utils/request";

const { bus } = WujieVue;
const sharedStore = useSharedStore();
const navsStore = useNavsStore();
const router = useRouter();
const route = useRoute();
const title = ref(import.meta.env.PUBLIC_TITLE);
const userName = ref(sharedStore.userInfo?.name || "管理员");
const userImg = ref(sharedStore.userInfo?.avatar || "");
const theme = ref(false);
const isMore = ref(false);
const list = ref([]);
const activeIndex = ref("1");

const getIcon = (iconName) => {
  if (!ElementPlusIconsVue[iconName]) {
    console.error(`ElementPlusIconsVue 中不存在名为 ${iconName} 的图标`);
    return null;
  }
  return ElementPlusIconsVue[iconName];
};

const select = (val) => {
  activeIndex.value = val;
  const url = findUrlByIndex(val);
  if (url) {
    isMore.value = false;
    router.push(url);
  }
};

const findUrlByIndex = (index) => {
  let url = "";
  const findUrl = (list) => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.id.toString() === index) {
        url = item.url;
        break;
      } else if (item.children) {
        findUrl(item.children);
      }
    }
  };
  findUrl(list.value);
  return url;
};

const findIndexByUrl = (url) => {
  let index = "";
  const findIndex = (list) => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.url === url) {
        index = item.id.toString();
        break;
      } else if (item.children) {
        findIndex(item.children);
      }
    }
  };
  findIndex(list.value);
  return index;
};

const toUserInfo = () => {};

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

router.afterEach((to, from) => {
  if (to.fullPath) {
    activeIndex.value = findIndexByUrl(to.fullPath);
  }
});

watch(
  () => navsStore.navsTree,
  (newStore, oldStore) => {
    if (!newStore) return;
    list.value = newStore;
    if (route.fullPath) {
      activeIndex.value = findIndexByUrl(route.fullPath);
    }
  },
  { deep: true, immediate: true },
);
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
      <div class="btn">
        <el-icon v-show="!isMore" @click="isMore = true"
          ><MoreFilled
        /></el-icon>
        <el-icon v-show="isMore" @click="isMore = false"><CloseBold /></el-icon>
      </div>
      <div class="content" v-show="isMore">
        <el-menu class="menu" :default-active="activeIndex" @select="select">
          <div class="item" v-for="(item, index) in list" :key="index">
            <el-menu-item :index="item.id.toString()" v-if="!item.children">
              <el-icon v-if="item.icon">
                <component :is="getIcon(item.icon)" />
              </el-icon>
              <span>{{ item.name }}</span>
            </el-menu-item>
            <el-sub-menu :index="item.id.toString()" v-if="item.children">
              <template #title>
                <el-icon v-if="item.icon">
                  <component :is="getIcon(item.icon)" />
                </el-icon>
                <span>{{ item.name }}</span>
              </template>
              <div
                class="items"
                v-for="(items, indexs) in item.children"
                :key="indexs + 's'"
              >
                <el-menu-item
                  :index="items.id.toString()"
                  v-if="!items.children"
                  >{{ items.name }}
                </el-menu-item>
                <el-sub-menu :index="items.id.toString()" v-if="items.children">
                  <template #title>
                    <span>{{ items.name }}</span>
                  </template>
                  <div
                    class="itemss"
                    v-for="(itemss, indexss) in items.children"
                    :key="indexss + 'ss'"
                  >
                    <el-menu-item :index="itemss.id.toString()"
                      >{{ itemss.name }}
                    </el-menu-item>
                  </div>
                </el-sub-menu>
              </div>
            </el-sub-menu>
          </div>
        </el-menu>

        <div class="mobile-controls">
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
      z-index: 2199;
      overflow-y: auto;
      padding: 20px;

      .menu {
        width: 100%;
        border-right: 0;
        background-color: transparent;

        :deep(.el-menu-item),
        :deep(.el-sub-menu__title) {
          height: 40px;
          line-height: 40px;
          font-size: 16px;
        }

        :deep(.el-sub-menu) {
          .el-menu-item {
            padding-left: 48px !important;
          }
        }
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
