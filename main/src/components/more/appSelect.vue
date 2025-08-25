<script setup>
import PIcon from "@Pcomponents/base/p-icon/index.vue";
import { ref, watch, onMounted } from "vue";
import request from "@Passets/utils/request";
const appsRef = ref(null);
const popoverRef = ref(null);
const appsList = ref([
  {
    name: "应用中心",
    children: [
      {
        name: "示例应用",
        icon: "el-icon-Memo",
        path: "/app/example",
      },
      {
        name: "系统管理",
        icon: "el-icon-setting",
        path: "/app/list",
      },
      {
        name: "设备管理系统",
        icon: "el-icon-setting",
        path: "/app/device",
      },
    ],
  },
]);
const appActive = ref({});

const getAppList = async () => {
  const res = await request.get({
    url: "/main/getMyAppList",
  });
  if (res.code != 200 || !res.data) {
    ElMessage.error(res.msg || "获取应用列表失败");
    return false;
  }
  appsList.value = res.data;
};
onMounted(() => {
  getAppList();
});

const toApp = (app) => {
  if (app.path == appActive.value.path) return;
  appActive.value = app;
  popoverRef.value.hide();
  // router.push(app.path);
};
</script>
<template>
  <div>
    <div class="apps" ref="appsRef">
      <p-icon class="icon1" :name="appActive.icon" size="16" />
      <span
        class="name"
        :style="{ width: appActive.icon ? '105px' : '121px' }"
        >{{ appActive.name || "选择应用" }}</span
      >
      <p-icon class="icon2" name="el-icon-ArrowDown" size="16" />
    </div>
    <el-popover
      virtual-triggering
      :virtual-ref="appsRef"
      trigger="click"
      width="340"
      ref="popoverRef"
    >
      <div class="list">
        <div class="fItem" v-for="(item, index) in appsList" :key="index">
          <div class="title">{{ item.name }}</div>
          <div class="children" v-if="item.children">
            <div
              class="child"
              :class="{ active: child.path == appActive.path }"
              v-for="(child, indexs) in item.children"
              :key="indexs + 's'"
              @click="toApp(child)"
            >
              <p-icon class="cIcon" :name="child.icon" />
              <span>{{ child.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<style scoped lang="scss">
.apps {
  background-color: var(--c-bg);
  color: var(--c-text3);
  display: flex;
  align-items: center;
  height: 30px;
  width: 154px;
  line-height: 30px;
  padding: 0 6px;
  border-radius: 5px;
  font-size: 14px;
  .name {
    width: 105px;
    margin-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.list {
  width: 320px;
  height: 200px;
  overflow-y: auto;
  padding: 12px;
  .fItem {
    width: 100%;
    .title {
      border-bottom: 1px solid var(--c-border);
      height: 30px;
      line-height: 30px;
    }
    .children {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding-top: 6px;
      .child {
        width: 140px;
        height: 30px;
        line-height: 30px;
        margin-right: 10px;
        margin-bottom: 6px;
        border: 1px solid var(--c-border);
        color: var(--c-text);
        display: flex;
        align-items: center;
        padding: 0 5px;
        border-radius: 5px;
        cursor: pointer;
        .cIcon {
          margin-right: 3px;
        }
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .child:nth-child(2n) {
        margin-right: 0;
      }
      .child:hover {
        background-color: var(--c-bg-box);
      }
      .child.active {
        background-color: var(--c-bg-theme);
        color: var(--c-text-theme);
      }
    }
  }
}
</style>
