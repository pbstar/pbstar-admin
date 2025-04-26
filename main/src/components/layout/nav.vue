<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const activeIndex = ref("1");
const list = ref([
  {
    title: "首页",
    url: "/admin/home",
    index: "1",
  },
  {
    title: "示例应用",
    index: "2",
    children: [
      {
        title: "首页",
        url: "/admin/apps?name=app-example&app-example=%2F",
        index: "2-1",
      },
    ],
  },
]);

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
      if (item.index === index) {
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
        index = item.index;
        break;
      } else if (item.children) {
        findIndex(item.children);
      }
    }
  };
  findIndex(list.value);
  return index;
};
// 初始化activeIndex
if (route.fullPath) {
  activeIndex.value = findIndexByUrl(route.fullPath);
}
router.afterEach((to, from) => {
  if (to.fullPath) {
    activeIndex.value = findIndexByUrl(to.fullPath);
  }
});
</script>
<template>
  <div class="navBox">
    <el-menu class="menu" :default-active="activeIndex" @select="select">
      <div class="item" v-for="(item, index) in list" :key="index">
        <el-menu-item :index="item.index" v-if="!item.children">
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
        <el-sub-menu :index="item.index" v-if="item.children">
          <template #title>
            <el-icon v-if="item.icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </template>
          <div
            class="items"
            v-for="(items, indexs) in item.children"
            :key="indexs + 's'"
          >
            <el-menu-item :index="items.index" v-if="!items.children"
              >{{ items.title }}
            </el-menu-item>
            <el-sub-menu :index="items.index" v-if="items.children">
              <template #title>
                <span>{{ items.title }}</span>
              </template>
              <div
                class="itemss"
                v-for="(itemss, indexss) in items.children"
                :key="indexss + 'ss'"
              >
                <el-menu-item :index="itemss.index"
                  >{{ itemss.title }}
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
  width: 200px;
  height: 100%;
  background-color: #fff;
}
.navBox .menu {
  height: 100%;
  padding: 5px 0;
  overflow-y: auto;
  border-right: 0;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(180, 211, 255, 0.6);
  }
  &::-webkit-scrollbar-track {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.1);
  }
}

.navBox :deep(.el-menu-item),
.navBox :deep(.el-sub-menu__title),
.navBox :deep(.el-menu-item-group__title) {
  font-size: 14px;
  height: 34px;
  line-height: 34px;
}
.navBox :deep(.el-menu-item:hover),
.navBox :deep(.el-sub-menu__title:hover),
.navBox .items :deep(.el-menu-item:hover),
.navBox .itemss :deep(.el-menu-item:hover),
.navBox .items :deep(.el-sub-menu__title:hover),
.navBox .itemss :deep(.el-sub-menu__title:hover) {
  background-color: transparent;
}
</style>
