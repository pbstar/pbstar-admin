<script setup>
import { pIcon } from "@Pcomponents";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAppsStore } from "@/stores/apps";
const router = useRouter();
const appsStore = useAppsStore();
const path = ref("");
const list = ref([]);

// 添加历史记录
const addItem = (fullPath) => {
  if (fullPath === path.value) return;
  path.value = fullPath;
  const hasPath = list.value.find((item) => item.path === fullPath);
  if (hasPath) return;
  const app = appsStore.getApp();
  if (!app || !app.navs) return;
  const nav = app.navs.find((item) => item.url === fullPath);
  if (!nav) return;
  list.value.push({
    name: nav.name,
    appId: appsStore.appId,
    path: fullPath,
  });
};
// 删除历史记录
const delItem = (url) => {
  list.value = list.value.filter((item) => item.path !== url);
  if (url === path.value) {
    let toPath = "";
    if (list.value.length === 0) {
      toPath = "/";
    } else {
      toPath = list.value[list.value.length - 1].path;
    }
    router.push(toPath);
  }
};
// 跳转路径
const toPath = async (item) => {
  if (item.path === path.value) return;
  if (item.appId !== appsStore.appId) {
    await appsStore.setAppId({
      id: item.appId,
    });
  }
  router.push(item.path);
};

router.afterEach((to, from) => {
  addItem(to.fullPath);
});
</script>
<template>
  <div class="historyBox">
    <div class="home" @click="toPath({ appId: 0, path: '/' })">
      <p-icon name="el-icon-house" />
    </div>
    <div class="list">
      <div
        class="item"
        :class="item.path === path ? 'active' : ''"
        v-for="(item, index) in list"
        :key="index"
        @click="toPath(item)"
      >
        <span>{{ item.name }}</span>
        <p-icon name="el-icon-close" @click.stop="delItem(item.path)" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.historyBox {
  width: 100%;
  height: 40px;
  padding: 5px 0;
  display: flex;
  align-items: center;
}
.historyBox .home {
  background-color: var(--c-bg);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
}
.historyBox .list {
  width: calc(100% - 30px);
  display: flex;
  align-items: center;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
.historyBox .list .item {
  height: 26px;
  background-color: var(--c-bg);
  display: flex;
  align-items: center;
  margin-left: 10px;
  cursor: pointer;
  padding-left: 6px;
  padding-right: 6px;
  border-radius: 2px;
  font-weight: 400;
  font-size: 12px;
  max-width: 120px;
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .icon {
    margin-left: 2px;
  }
}
.historyBox .list .item.active {
  color: var(--c-text3);
}
</style>
