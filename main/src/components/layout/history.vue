<script setup>
import { House, Close } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref } from "vue";
import request from "@Passets/utils/request";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const path = ref("");
const list = ref([]);
const navList = ref([]);

const addItem = (fullPath) => {
  if (fullPath == path.value) return;
  path.value = fullPath;
  let hasPath = false;
  list.value.forEach((element) => {
    if (element.path == fullPath) {
      hasPath = true;
      return;
    }
  });
  if (hasPath) return;
  const obj = navList.value.find((item) => item.url == fullPath);
  if (obj) {
    list.value.push({
      name: obj.name,
      path: obj.url,
    });
  }
};
const delItem = (url) => {
  list.value = list.value.filter((item) => item.path != url);
  if (url == path.value) {
    let toPath = "";
    if (list.value.length == 0) {
      toPath = "/";
    } else {
      toPath = list.value[list.value.length - 1].path;
    }
    router.push(toPath);
  }
};
const toPath = (url) => {
  if (url == path.value) return;
  router.push(url);
};
const getList = async () => {
  request
    .get({
      base: "base",
      url: "/base/getNavList",
    })
    .then((res) => {
      if (res.code === 200) {
        navList.value = res.data;
        if (route.fullPath) {
          addItem(route.fullPath);
        }
      } else {
        ElMessage.error(res.msg || "获取菜单失败");
      }
    });
};
getList();

router.afterEach((to, from) => {
  addItem(to.fullPath);
});
</script>
<template>
  <div class="historyBox">
    <div class="home" @click="toPath('/')">
      <el-icon><House /></el-icon>
    </div>
    <div class="list">
      <div
        class="item"
        :class="item.path == path ? 'active' : ''"
        v-for="(item, index) in list"
        :key="index"
        @click="toPath(item.path)"
      >
        <span>{{ item.name }}</span>
        <el-icon class="icon" @click.stop="delItem(item.path)"
          ><Close
        /></el-icon>
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
  width: calc(100% - 38px);
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
