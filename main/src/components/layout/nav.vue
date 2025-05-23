<script setup>
import { ref, watch } from "vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { useNavsStore } from "@/stores/navs";
const router = useRouter();
const route = useRoute();
const navsStore = useNavsStore();
const activeIndex = ref("1");
const list = ref([]);

const getIcon = (iconName) => {
  if (!ElementPlusIconsVue[iconName]) {
    console.error(`ElementPlusIconsVue 中不存在名为 ${iconName} 的图标`);
    return null; // 或者返回一个默认的图标组件
  }
  return ElementPlusIconsVue[iconName];
};
const select = (val) => {
  activeIndex.value = val;
  const url = findUrlByIndex(val);
  if (url) {
    router.push(url);
  }
};
//找到index对应的url
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
// 找到当前url对应的index
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
</script>
<template>
  <div class="navBox">
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
  background: var(--c-menu-gradient);
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
  margin: 4px 12px;
  border-radius: 8px;
  color: var(--c-text);
  padding: 0 12px !important;
}

/* 激活状态样式 */
.navBox :deep(.el-menu-item.is-active) {
  background: var(--c-menu-active-bg) !important;
  color: var(--c-text3) !important;
  font-weight: 500;
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
  padding-left: 24px !important;
  color: var(--c-text2);
}

/* 孙菜单缩进 */
.navBox :deep(.items .el-sub-menu__title) {
  padding-left: 24px !important;
}
.navBox :deep(.items .el-sub-menu .el-menu-item) {
  padding-left: 36px !important;
}

/* 图标样式 */
.navBox :deep(.el-icon) {
  font-size: 18px;
  vertical-align: middle;
  color: var(--c-text3);
}

/* 层级指示线 */
.navBox :deep(.el-sub-menu .el-menu) {
  background: var(--c-menu-sub-bg);
  padding: 4px 0;
}

/* 子菜单箭头 */
.navBox :deep(.el-sub-menu__icon-arrow) {
  color: var(--c-text2);
  margin-right: 0;
  top: 16px;
  right: 12px;
  /* transition: transform 0.3s; */
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
