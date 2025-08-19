<script setup>
import PIcon from "@Pcomponents/base/p-icon/index.vue";
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
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
    ],
  },
]);
const appActive = ref({});

const toPath = (url) => {
  if (url == path.value) return;
  router.push(url);
};
</script>
<template>
  <el-dropdown trigger="click">
    <div class="apps">
      <p-icon class="icon" :name="appActive.icon" />
      {{ appActive.name || "选择应用" }}
      <p-icon class="icon2" name="el-icon-ArrowDown" />
    </div>
    <template #dropdown>
      <div class="list">
        <div class="fItem" v-for="(item, index) in appsList" :key="index">
          <div class="title">{{ item.name }}</div>
          <div class="children" v-if="item.children">
            <div
              class="child"
              v-for="(child, indexs) in item.children"
              :key="indexs + 's'"
            >
              <p-icon class="cIcon" :name="child.icon" />
              {{ child.name }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>
<style scoped lang="scss">
.apps {
  background-color: var(--c-bg);
  color: var(--c-text3);
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 6px;
  border-radius: 5px;

  .icon2 {
    margin-left: 5px;
  }
}
.list {
  width: 330px;
  height: 200px;
  padding: 20px;
  .fItem {
    width: 100%;
    height: 30px;
    .title {
      border-bottom: 1px solid var(--c-border);
      line-height: 30px;
    }
    .children {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding-top: 6px;
      .child {
        width: 90px;
        height: 30px;
        line-height: 30px;
        margin-right: 10px;
        margin-bottom: 6px;
        background-color: var(--c-bg-theme-light);
        color: var(--c-text);
        display: flex;
        align-items: center;
        padding: 0 5px;
        border-radius: 5px;
        cursor: pointer;
        .cIcon {
          margin-right: 3px;
        }
      }
      .child:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
}
</style>
