<script setup>
import PIcon from "@Pcomponents/base/p-icon/index.vue";
import { ref, onBeforeMount, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppsStore } from "@/stores/apps";
const appsStore = useAppsStore();
const router = useRouter();
const appsRef = ref(null);
const popoverRef = ref(null);
const appsList = ref([]);
const appsTree = ref([]);
const appActive = ref({});
const isLoading = ref(false);
const getAppsGroup = (myApps) => {
  const groupMap = {};
  myApps.forEach((item) => {
    if (!groupMap[item.group]) {
      groupMap[item.group] = {
        name: item.group,
        children: [],
      };
    }
    groupMap[item.group].children.push(item);
  });
  return Object.values(groupMap);
};

onBeforeMount(() => {
  appsList.value = appsStore.getApps();
  const appId = appsStore.appId;
  appsTree.value = getAppsGroup(appsList.value);
  if (appId) {
    appActive.value = appsList.value.find((item) => item.id == appId);
  }
});

const toApp = async (app) => {
  if (app.id == appActive.value?.id) return;
  isLoading.value = true;
  const isOk = await appsStore.setAppId({
    id: app.id,
  });
  isLoading.value = false;
  if (!isOk) return;
  appActive.value = app;
  const newApp = appsStore.getApp();
  if (newApp && newApp.navs) {
    const firstNav = newApp.navs.find((e) => e.url);
    if (firstNav) {
      router.push(firstNav.url);
    }
  }
  popoverRef.value.hide();
};
watch(
  () => appsStore.appId,
  (newVal) => {
    if (newVal && newVal != appActive.value?.id) {
      const newApp = appsList.value.find((item) => item.id == newVal);
      appActive.value = newApp || {};
    } else {
      appActive.value = {};
    }
  },
);
</script>
<template>
  <div>
    <div class="apps" ref="appsRef">
      <p-icon class="icon1" :name="appActive?.icon" size="16" />
      <span
        class="name"
        :style="{ width: appActive?.icon ? '105px' : '121px' }"
        >{{ appActive?.name || "选择应用" }}</span
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
      <div class="list" v-loading="isLoading">
        <div class="fItem" v-for="(item, index) in appsTree" :key="index">
          <div class="title">{{ item.name }}</div>
          <div class="children" v-if="item.children">
            <div
              class="child"
              :class="{ active: child.id == appActive?.id }"
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
  cursor: pointer;
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
