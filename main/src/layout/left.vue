<template>
  <div class="left">
    <t-menu
      theme="light"
      :width="['230px', '60px']"
      :value="menuValue"
      :collapsed="props.collapsed"
      @change="changeMenu"
    >
      <template #logo>
        <h3 v-show="props.collapsed" class="logo">PA</h3>
        <h3 v-show="!props.collapsed" class="logo">{{ title }}</h3>
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
</template>
<script setup>
import { ref, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { cloneDeep } from "es-toolkit/object";
import PConfig from "@PConfig";
import useUserStore from "@/stores/user";
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});
const router = useRouter();
const route = useRoute();
const user = useUserStore();
const title = ref(PConfig.title);
const leftList = ref([]);
const menuList = ref([]);
const menuValue = ref("");
const changeMenuValue = () => {
  let id = menuList.value.find((item) => item.path === route.fullPath)?.id;
  if (!id || menuValue.value == id) return;
  nextTick(() => {
    menuValue.value = id;
  });
};
user.getMenuList().then((res) => {
  menuList.value = res;
  leftList.value = buildStructuredMenu(cloneDeep(res));
  changeMenuValue();
});
router.afterEach((to) => {
  if (!user.isLogin) {
    menuList.value = [];
    leftList.value = [];
  }
  changeMenuValue();
});
const changeMenu = (e) => {
  let path = menuList.value.find((item) => item.id == e)?.path;
  let link = menuList.value.find((item) => item.id == e)?.link;
  if (link) {
    window.open(link, "_blank");
    return;
  }
  if (!path) return;
  menuValue.value = e;
  router.push(path);
};
//结构化菜单
const buildStructuredMenu = (flatMenu) => {
  let structuredMenu = [];
  flatMenu = flatMenu.sort((a, b) => a.parentId - b.parentId);
  flatMenu.forEach((item) => {
    if (!item.isMenu) return;
    if (item.parentId == 0) {
      structuredMenu.push(item);
    } else {
      let parent = structuredMenu.find((i) => i.id == item.parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
      }
    }
  });
  return structuredMenu;
};
</script>
<style scoped lang="scss">
.left {
  .logo {
    margin-left: 0;
    text-align: center;
    color: #165dff;
    width: 100%;
    font-size: 20px;
  }
}
</style>
