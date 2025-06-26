<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import PCollapse from "@Pcomponents/base/p-collapse/index.vue";
import PItem from "@Pcomponents/base/p-item/index.vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  id: {
    type: [String, Number],
    default: "",
  },
});
const detailInfo = ref({});
const detailType = ref("");
const detailId = ref("");
const navList = ref([]); // 菜单树结构
const icons = ref([]);

onBeforeMount(() => {
  detailType.value = props.type;
  detailId.value = props.id;
  getNavList();
  if (detailType.value == "view" || detailType.value == "edit") {
    getDetailInfo();
  }
  icons.value = Object.keys(ElementPlusIconsVue);
});

const getIcon = (iconName) => {
  if (!ElementPlusIconsVue[iconName]) {
    console.error(`ElementPlusIconsVue 中不存在名为 ${iconName} 的图标`);
    return null; // 或者返回一个默认的图标组件
  }
  return ElementPlusIconsVue[iconName];
};

const getNavList = () => {
  request
    .get({
      base: "base",
      url: "/system/nav/getAllList",
    })
    .then((res) => {
      if (res.code === 200) {
        navList.value = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
            ...item,
          };
        });
      } else {
        ElMessage.error(res.msg || "获取菜单失败");
      }
    });
};

const getDetailInfo = () => {
  request
    .get({
      base: "base",
      url: "/system/nav/getDetail",
      data: {
        id: detailId.value,
      },
    })
    .then((res) => {
      if (res && res.code == 200) {
        detailInfo.value = res.data;
      } else {
        ElMessage.error(res.msg || "操作异常");
      }
    });
};
const getFormValue = () => {
  return detailInfo.value;
};

defineExpose({
  getFormValue,
});
</script>

<template>
  <div class="detail">
    <p-collapse title="基础信息" :isControl="false" :showDownLine="false">
      <div class="items">
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'input',
            label: '菜单名称',
          }"
          v-model="detailInfo.name"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'input',
            label: '菜单链接',
          }"
          v-model="detailInfo.url"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'selectTree',
            label: '上级菜单',
            options: navList,
            more: {
              checkStrictly: true,
            },
          }"
          v-model="detailInfo.parentId"
        />
        <p-item
          class="dtItem"
          :config="{
            type: 'slot',
            label: '菜单图标',
          }"
        >
          <el-popover placement="bottom-start" width="254" trigger="click">
            <div
              style="
                max-height: 220px;
                overflow-y: auto;
                display: flex;
                flex-wrap: wrap;
              "
            >
              <el-icon
                v-for="(item, index) in icons"
                :key="index"
                @click="detailInfo.icon = item"
                style="font-size: 16px; margin: 3px 4px; cursor: pointer"
              >
                <component :is="getIcon(item)"></component>
              </el-icon>
            </div>
            <template #reference>
              <el-button
                type="primary"
                :icon="
                  detailInfo.icon
                    ? getIcon(detailInfo.icon)
                    : getIcon('Promotion')
                "
              >
                {{ detailInfo.icon ? detailInfo.icon : "选择图标" }}
              </el-button>
            </template>
          </el-popover>
        </p-item>
      </div>
    </p-collapse>
  </div>
</template>

<style scoped lang="scss">
.detail {
  padding: 0 10px;
  .items {
    display: flex;
    flex-direction: column;

    .dtItem {
      width: 100%;
      margin-bottom: 10px;
    }
  }
}
</style>
