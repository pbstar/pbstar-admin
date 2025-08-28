<script setup>
import { ref, watch, onBeforeMount } from "vue";
import PIcon from "@Pcomponents/base/p-icon/index.vue";
import { useRouter, useRoute } from "vue-router";
import { useAppsStore } from "@/stores/apps";
const router = useRouter();
const route = useRoute();
const appsStore = useAppsStore();
const activeIndex = ref("1");
const list = ref([]);
const listTree = ref([]);

const select = (val) => {
  activeIndex.value = val;
  const url = list.value.find((item) => item.id.toString() === val)?.url;
  if (url) {
    router.push(url);
  }
};

// 屏蔽无界嵌套引起的vue路由警告
const originalWarn = console.warn;
console.warn = (msg, ...args) => {
  // 如果警告信息包含特定字符串，则忽略
  if (msg.includes("history.state") && msg.includes("manually replaced")) {
    return;
  }
  originalWarn.apply(console, [msg, ...args]);
};

router.afterEach((to, from) => {
  if (to.fullPath) {
    const nav = list.value.find((item) => item.url === to.fullPath);
    activeIndex.value = nav?.id.toString() || "1";
  }
});
onBeforeMount(() => {
  if (route.fullPath) {
    const nav = list.value.find((item) => item.url === route.fullPath);
    activeIndex.value = nav?.id.toString() || "1";
  }
});

watch(
  () => appsStore.appId,
  (newStore, oldStore) => {
    if (newStore) {
      const app = appsStore.getApp();
      if (!app) return;
      list.value = app.navs;
      listTree.value = app.navsTree;
    } else {
      list.value = [
        {
          id: 1,
          name: "首页",
          url: "/admin/pHome",
          icon: "el-icon-house",
        },
      ];
      listTree.value = list.value;
    }
  },
  { immediate: true },
);
</script>
<template>
  <div class="navBox">
    <el-menu class="menu" :default-active="activeIndex" @select="select">
      <div class="item" v-for="(item, index) in listTree" :key="index">
        <el-menu-item :index="item.id.toString()" v-if="!item.children">
          <p-icon v-if="item.icon" :name="item.icon" />
          <span>{{ item.name }}</span>
        </el-menu-item>
        <el-sub-menu :index="item.id.toString()" v-if="item.children">
          <template #title>
            <p-icon v-if="item.icon" :name="item.icon" />
            <span>{{ item.name }}</span>
          </template>
          <div
            class="items"
            v-for="(items, indexs) in item.children"
            :key="indexs + 's'"
          >
            <el-menu-item :index="items.id.toString()" v-if="!items.children"
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
  </div>
</template>
<style scoped>
.navBox {
  width: 100%;
  height: 100%;
  background: var(--c-bg);
  overflow: hidden;
}

.navBox .menu {
  height: 100%;
  padding: 10px 0;
  overflow-y: auto;
  border-right: 0;
  background: transparent !important;
}

/* 菜单项基础样式 */
.navBox :deep(.el-menu-item),
.navBox :deep(.el-sub-menu__title) {
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  margin: 0 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  color: var(--c-text);
  padding: 0 12px !important;
}

/* 激活状态样式 */
.navBox :deep(.el-menu-item.is-active) {
  background: var(--c-menu-active-bg) !important;
  color: var(--c-text3) !important;
  position: relative;
}

.navBox :deep(.el-menu-item.is-active)::after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: var(--c-text3);
  border-radius: 2px;
}

/* 悬停效果 */
.navBox :deep(.el-menu-item:hover),
.navBox :deep(.el-sub-menu__title:hover) {
  background: var(--c-menu-hover-bg) !important;
}

/* 子菜单缩进 */
.navBox :deep(.el-sub-menu .el-menu-item) {
  margin-left: 24px;
}

/* 孙菜单缩进 */
.navBox :deep(.items .el-sub-menu__title) {
  margin-left: 24px;
}
.navBox :deep(.items .el-sub-menu .el-menu-item) {
  margin-left: 36px;
}

/* 图标样式 */
.navBox :deep(.el-icon) {
  font-size: 18px;
  vertical-align: middle;
  color: var(--c-text3);
}

/* 子菜单箭头 */
.navBox :deep(.el-sub-menu__icon-arrow) {
  color: var(--c-text);
  margin-right: 0;
  top: 16px;
  right: 12px;
}

/* 滚动条美化 */
.navBox .menu::-webkit-scrollbar {
  width: 6px;
}

.navBox .menu::-webkit-scrollbar-track {
  background: var(--c-scrollbar-track);
  border-radius: 4px;
}

.navBox .menu::-webkit-scrollbar-thumb {
  background: var(--c-scrollbar-thumb);
  border-radius: 4px;
}
</style>
