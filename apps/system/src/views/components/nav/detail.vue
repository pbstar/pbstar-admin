<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import request from "@Passets/utils/request";
import { pCollapse, pItem, pIconSelect } from "@Pcomponents";
import btnTable from "./btnTable.vue";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  id: {
    type: [String, Number],
    default: "",
  },
  appId: {
    type: [String, Number],
    default: "",
  },
});
const detailInfo = ref({
  isNav: 1,
  appId: Number(props.appId),
});
const detailType = ref("");
const detailId = ref("");
const appList = ref([]); // 应用列表
const navList = ref([]); // 菜单树结构

onBeforeMount(() => {
  detailType.value = props.type;
  detailId.value = props.id;
  getAppList();
  getNavList();
  if (detailType.value == "view" || detailType.value == "edit") {
    getDetailInfo();
  }
});

const getAppList = () => {
  request
    .post({
      url: "/system/app/getList",
    })
    .then((res) => {
      if (res && res.code === 200) {
        appList.value = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
            ...item,
          };
        });
      } else {
        ElMessage.error(res.msg || "获取应用失败");
      }
    });
};
const getNavList = () => {
  request
    .post({
      url: "/system/nav/getList",
      data: {
        appId: detailInfo.value.appId,
      },
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
        <p-item class="dtItem" label="所属应用">
          <el-select
            v-model="detailInfo.appId"
            placeholder="请选择所属应用"
            disabled
          >
            <el-option
              v-for="item in appList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </p-item>
        <p-item
          class="dtItem"
          label="菜单名称"
          :text="detailType === 'view' ? detailInfo.name : ''"
        >
          <el-input v-model="detailInfo.name" placeholder="请输入菜单名称" />
        </p-item>
        <p-item
          class="dtItem"
          label="菜单链接"
          :text="detailType === 'view' ? detailInfo.url : ''"
        >
          <el-input v-model="detailInfo.url" placeholder="请输入菜单链接" />
        </p-item>
        <p-item
          class="dtItem"
          label="上级菜单"
          :text="detailType === 'view' ? detailInfo.parentId : ''"
        >
          <el-tree-select
            v-model="detailInfo.parentId"
            :data="navList"
            :props="{ value: 'value', label: 'label', children: 'children' }"
            check-strictly
            placeholder="请选择上级菜单"
          />
        </p-item>
        <p-item class="dtItem" label="菜单图标">
          <p-iconSelect title="选择图标" v-model="detailInfo.icon" />
        </p-item>
        <p-item class="dtItem" label="是否显示在导航">
          <el-radio-group v-model="detailInfo.isNav">
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
        </p-item>
        <p-item
          class="dtItem"
          label="排序"
          :text="detailType === 'view' ? String(detailInfo.index) : ''"
        >
          <el-input-number
            v-model="detailInfo.index"
            :min="0"
            placeholder="请输入排序"
          />
        </p-item>
        <p-item
          class="dtItem"
          label="备注"
          :text="detailType === 'view' ? detailInfo.remark : ''"
          isTextWrap
        >
          <el-input
            v-model="detailInfo.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注"
          />
        </p-item>
        <p-item class="dtItem" label="页面按钮">
          <btnTable :type="detailType" v-model="detailInfo.btnList" />
        </p-item>
      </div>
    </p-collapse>
  </div>
</template>

<style scoped lang="scss">
.detail {
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
