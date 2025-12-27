<script setup>
import { pIcon } from "@Pcomponents";
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useAppsStore } from "@/stores/apps";
const router = useRouter();
const appsStore = useAppsStore();
const path = ref("");
const list = ref([]);
const historyBox = ref(null);
const listRef = ref(null);

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
  // 如果宽度超出，删除最前面的一条记录
  nextTick(() => {
    const width = historyBox.value.clientWidth - 100;
    if (listRef.value.scrollWidth > width) {
      list.value.shift();
    }
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
addItem(router.currentRoute.value.fullPath);
router.afterEach((to, from) => {
  addItem(to.fullPath);
});
</script>
<template>
  <div class="historyBox" ref="historyBox">
    <el-tag
      class="home"
      :effect="path === '/admin/pHome' ? 'dark' : 'plain'"
      @click="toPath({ appId: 0, path: '/' })"
    >
      <p-icon name="el-icon-house" />
    </el-tag>
    <div class="list" ref="listRef">
      <el-tag
        v-for="(item, index) in list"
        :key="index"
        class="item"
        @click="toPath(item)"
        :effect="item.path === path ? 'dark' : 'plain'"
        closable
        @close="delItem(item.path)"
      >
        <span class="name">{{ item.name }}</span>
      </el-tag>
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
  border-radius: 12px;
  cursor: pointer;
}
.historyBox .list {
  display: flex;
  align-items: center;
}
.historyBox .list .item {
  margin-left: 6px;
  cursor: pointer;
  max-width: 126px;
  .name {
    display: inline-block;
    max-width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
