<template>
  <el-menu class="menu" :default-active="activeIndex" @select="handleSelect">
    <div class="item" v-for="(item, index) in menuList" :key="index">
      <el-menu-item :index="item.id.toString()" v-if="!item.children">
        <p-icon v-if="item.icon" :name="item.icon" />
        <span>{{ item.name }}</span>
      </el-menu-item>
      <el-sub-menu :index="item.id.toString()" v-if="item.children">
        <template #title>
          <p-icon v-if="item.icon" :name="item.icon" />
          <span>{{ item.name }}</span>
        </template>
        <div
          class="items"
          v-for="(items, indexs) in item.children"
          :key="indexs + 's'"
        >
          <el-menu-item :index="items.id.toString()" v-if="!items.children">
            {{ items.name }}
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
              <el-menu-item :index="itemss.id.toString()">
                {{ itemss.name }}
              </el-menu-item>
            </div>
          </el-sub-menu>
        </div>
      </el-sub-menu>
    </div>
  </el-menu>
</template>

<script setup>
import PIcon from "@Pcomponents/base/p-icon/index.vue";

const props = defineProps({
  menuList: {
    type: Array,
    required: true,
  },
  activeIndex: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["select"]);

const handleSelect = (index) => {
  emit("select", index);
};
</script>

<style scoped lang="scss">
@media (min-width: 701px) {
  .menu {
    height: 100%;
    padding: 10px 0;
    overflow-y: auto;
    border-right: 0;
    background: transparent !important;
  }

  /* 菜单项基础样式 */
  .menu :deep(.el-menu-item),
  .menu :deep(.el-sub-menu__title) {
    font-size: 14px;
    height: 36px;
    line-height: 36px;
    margin: 0 12px;
    margin-bottom: 4px;
    border-radius: 8px;
    color: var(--c-text);
    padding: 0 12px !important;
  }

  /* 激活状态样式 */
  .menu :deep(.el-menu-item.is-active) {
    background: var(--c-menu-active-bg) !important;
    color: var(--c-text3) !important;
    position: relative;
  }

  .menu :deep(.el-menu-item.is-active)::after {
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
  .menu :deep(.el-menu-item:hover),
  .menu :deep(.el-sub-menu__title:hover) {
    background: var(--c-menu-hover-bg) !important;
  }

  /* 子菜单缩进 */
  .menu :deep(.el-sub-menu .el-menu-item) {
    margin-left: 24px;
  }

  /* 孙菜单缩进 */
  .menu :deep(.items .el-sub-menu__title) {
    margin-left: 24px;
  }
  .menu :deep(.items .el-sub-menu .el-menu-item) {
    margin-left: 36px;
  }

  /* 图标样式 */
  .menu :deep(.el-icon) {
    font-size: 18px;
    vertical-align: middle;
    color: var(--c-text3);
  }

  /* 子菜单箭头 */
  .menu :deep(.el-sub-menu__icon-arrow) {
    color: var(--c-text);
    margin-right: 0;
    top: 16px;
    right: 12px;
  }

  /* 滚动条美化 */
  .menu::-webkit-scrollbar {
    width: 6px;
  }

  .menu::-webkit-scrollbar-track {
    background: var(--c-scrollbar-track);
    border-radius: 4px;
  }

  .menu::-webkit-scrollbar-thumb {
    background: var(--c-scrollbar-thumb);
    border-radius: 4px;
  }
}
@media (max-width: 700px) {
  .menu {
    width: 100%;
    border-right: 0;
    background-color: transparent;

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      height: 36px;
      line-height: 36px;
      font-size: 16px;
    }

    :deep(.el-sub-menu) {
      .el-menu-item {
        padding-left: 48px !important;
      }
    }
  }
}
</style>
