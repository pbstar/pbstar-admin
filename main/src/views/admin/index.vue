<template>
  <div class="page">
    <div class="left">
      <t-menu
        theme="light"
        :width="['230px', '60px']"
        :value="menuValue"
        :collapsed="collapsed"
        @change="changeMenu"
      >
        <template #logo>
          <h3 v-show="collapsed" class="logo">PA</h3>
          <h3 v-show="!collapsed" class="logo">{{ title }}</h3>
        </template>
        <div v-for="(item, index) in leftList" :key="index">
          <div v-show="!item.children">
            <t-menu-item :value="item.id">
              <template #icon>
                <t-icon :name="item.icon" />
              </template>
              <span>{{ item.name }}</span>
            </t-menu-item>
          </div>
          <div v-show="item.children">
            <t-submenu :value="item.id" mode="popup">
              <template #icon>
                <t-icon :name="item.icon" />
              </template>
              <template #title>
                <span>{{ item.name }}</span>
              </template>
              <t-menu-item
                v-for="(items, indexs) in item.children"
                :key="indexs + 's'"
                :value="items.id"
                >{{ items.name }}</t-menu-item
              >
            </t-submenu>
          </div>
        </div>
      </t-menu>
    </div>
    <div class="right">
      <div class="r_top">
        <div class="r_t_left">
          <t-button variant="text" shape="square" @click="changeCollapsed">
            <template #icon>
              <t-icon :name="collapsed ? 'menu-fold' : 'menu-unfold'" />
            </template>
          </t-button>
          <span class="pageName">{{ pageName }}</span>
        </div>
        <div class="r_t_right">
          <t-dropdown
            :options="options"
            placement="bottom"
            trigger="click"
            @click="clickHandler"
          >
            <t-button variant="text">
              <template #icon> <t-icon name="user" size="16" /></template>
              <span>{{ name }}</span>
              <template #suffix>
                <t-icon name="chevron-down" size="16"
              /></template>
            </t-button>
          </t-dropdown>
        </div>
      </div>
      <div class="r_bottom">
        <div class="r_b_box">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, nextTick } from "vue";
import { RouterView, useRouter } from "vue-router";
import { cloneDeep } from "es-toolkit/object";
import PConfig from "@PConfig";
import useUserStore from "@/stores/user";

const user = useUserStore();
const router = useRouter();
let title = ref(PConfig.title);
const collapsed = ref(false);
const pageName = ref("");
const options = ref([{ content: "退出登录", value: 2 }]);
const leftList = ref([]);
const menuList = ref([]);
const menuValue = ref("");
const userInfo = user.getInfo();
const name = ref(userInfo.user_info.name);

user.getMenuList().then((res) => {
  menuList.value = cloneDeep(res);
  leftList.value = buildStructuredMenu(menuList.value);
  changeMenuValue();
});

const changeMenuValue = () => {
  nextTick(() => {
    let path = router.currentRoute.value.fullPath.replace("%2F", "/");
    pageName.value = router.currentRoute.value.meta.title || "";
    let id = menuList.value.find((item) => item.path === path)?.id || "";
    if (menuValue.value != id && id) {
      menuValue.value = id;
    }
  });
};
watch(
  () => router.currentRoute.value,
  (newValue, oldValue) => {
    changeMenuValue();
  },
  { immediate: true }
);
const changeCollapsed = () => {
  collapsed.value = !collapsed.value;
};

const clickHandler = (e) => {
  if (e.value === 2) {
    user.clearInfo();
    router.push({ path: "/login" });
  }
};
const changeMenu = (e) => {
  let path = menuList.value.find((item) => item.id == e)?.path;
  if (!path) return;
  menuValue.value = e;
  router.push(path);
};
function buildStructuredMenu(flatMenu) {
  let structuredMenu = [];
  flatMenu.forEach((item) => {
    if (item.parentId == 0) {
      structuredMenu.push(item);
    } else {
      let parent = structuredMenu.find((i) => i.id == item.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(item);
      }
    }
  });
  return structuredMenu;
}
</script>
<style scoped lang="scss">
.page {
  height: 100vh;
  display: flex;

  .left {
    .logo {
      margin-left: 0;
      text-align: center;
      color: #165dff;
      width: 100%;
      font-size: 20px;
    }
  }

  .right {
    flex: 1;
    background-color: #f6f6f6;

    .r_top {
      height: 56px;
      width: 100%;
      background-color: #fff;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      align-items: center;
      padding: 0 20px;
      justify-content: space-between;

      .r_t_left {
        display: flex;
        align-items: center;

        .pageName {
          margin-left: 10px;
          font-size: 14px;
        }
      }
    }

    .r_bottom {
      height: calc(100vh - 56px);
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      overflow-y: auto;

      .r_b_box {
        width: calc(100% - 20px);
        min-height: calc(100vh - 56px - 10px);
        margin: 10px 10px 0;
        background-color: #fff;
        overflow: hidden;
      }
    }
  }
}
</style>
