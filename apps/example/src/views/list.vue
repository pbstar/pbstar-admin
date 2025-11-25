<template>
  <div class="page">
    <p-title :list="['用户列表']"></p-title>
    <p-search
      style="margin-top: 10px"
      ref="searchRef"
      :data="searchData"
      @btnClick="toSearch"
    ></p-search>
    <p-table
      style="margin-top: 10px"
      ref="tableRef"
      :data="data"
      :pagination="pagination"
      @paginationChange="toPageChange"
    >
      <template #column>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="age" label="年龄">
          <template #default="{ row }">
            <span v-show="row.age < 25">{{ row.age }}</span>
            <span v-show="row.age >= 25">{{ row.age }}（老年人）</span>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别">
          <template #default="{ row }">
            {{ getSexLabel(row.sex) }}
          </template>
        </el-table-column>
        <el-table-column prop="ethnic" label="民族">
          <template #default="{ row }">
            {{
              getEnumOptions("ethnic").find((item) => item.value == row.ethnic)
                ?.label || row.ethnic
            }}
          </template>
        </el-table-column>
        <el-table-column prop="isHealthy" label="是否健康">
          <template #default="{ row }">
            {{
              getEnumOptions("boolean").find(
                (item) => item.value == row.isHealthy,
              )?.label || row.isHealthy
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          fixed="right"
          width="200"
        >
          <template #default="{ row }">
            <p-button
              type="primary"
              size="small"
              link
              @click="toRightBtnClick({ row, btn: 'view' })"
            >
              查看
            </p-button>
            <p-button
              type="primary"
              size="small"
              link
              @click="toRightBtnClick({ row, btn: 'edit' })"
            >
              编辑
            </p-button>
            <el-dropdown trigger="click">
              <el-button
                style="margin-left: 5px; margin-top: 2px"
                type="primary"
                link
                size="small"
              >
                <span>更多</span>
                <p-icon name="el-icon-arrow-down" />
              </el-button>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    @click="toRightBtnClick({ row, btn: 'delete' })"
                    >删除
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="toRightBtnClick({ row, btn: 'other' })"
                    >其他
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </template>
      <template #topLeft>
        <p-button type="primary" @click="toTopBtnClick()"> 新增 </p-button>
      </template>
    </p-table>
    <p-dialog title="用户列表详情页" type="page" v-model="isDetail">
      <Detail ref="detailRef" :type="detailType" :id="detailId"></Detail>
      <template #footer>
        <p-button
          type="primary"
          @click="diaBotBtnClick('save')"
          v-if="detailType !== 'view'"
        >
          保存
        </p-button>
        <p-button @click="diaBotBtnClick('back')"> 返回 </p-button>
      </template>
    </p-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import { PTable, PSearch, PTitle, PDialog, PButton, PIcon } from "@Pcomponents";
import { useEnumStore } from "@Passets/stores/enum";
import Detail from "./components/list/detail.vue";
const data = ref([]);
const enumStore = useEnumStore();

const tableRef = ref(null);
const pagination = ref({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
});
const searchRef = ref(null);
const searchData = ref([
  { key: "name", label: "姓名", type: "input" },
  { key: "age", label: "年龄", type: "inputNumber" },
  { key: "sex", label: "性别", type: "select", options: [] },
  {
    key: "isHealthy",
    label: "是否健康",
    type: "select",
    enumKey: "boolean",
  },
]);
const searchValue = ref({});
const isDetail = ref(false);
const detailType = ref("");
const detailId = ref("");
const detailRef = ref(null);
const sexOptions = ref([
  { label: "男", value: "1" },
  { label: "女", value: "2" },
]);

// 根据 value 获取 label
const getSexLabel = (value) => {
  const option = sexOptions.value.find((item) => item.value === value);
  return option ? option.label : value;
};

// 根据 enumKey 和 value 获取枚举 label
const getEnumLabel = async (enumKey, value) => {
  if (!enumKey || !value) return value;
  const enumData = await enumStore.getEnum(enumKey);
  if (enumData?.[enumKey]) {
    const option = enumData[enumKey].find((item) => item.value == value);
    return option ? option.label : value;
  }
  return value;
};

// 获取枚举选项（用于响应式显示）
const getEnumOptions = (enumKey) => {
  return enumStore.enums[enumKey] || [];
};

onMounted(async () => {
  // 预加载枚举数据
  await enumStore.getEnum("ethnic,boolean");
  searchRef.value.toChangeData([
    {
      key: "sex",
      options: sexOptions.value,
    },
  ]);
  initTable();
});
const toSearch = ({ data }) => {
  searchValue.value = data;
  initTable();
};
const toPageChange = ({ pageNumber, pageSize }) => {
  pagination.value.pageNumber = pageNumber;
  pagination.value.pageSize = pageSize;
  initTable();
};
const initTable = () => {
  request
    .post({
      url: "/example/person/getList",
      data: { ...searchValue.value, ...pagination.value },
    })
    .then((res) => {
      if (res && res.code == 200) {
        data.value = res.data.list;
        pagination.value.total = res.data.total;
      } else {
        ElMessage.error(res.msg || "操作异常");
      }
    });
};
const toTopBtnClick = () => {
  detailType.value = "add";
  detailId.value = "";
  isDetail.value = true;
};
const toRightBtnClick = ({ btn, row }) => {
  if (btn == "view" || btn == "edit") {
    detailType.value = btn;
    detailId.value = row.id;
    isDetail.value = true;
  } else if (btn == "delete") {
    ElMessageBox.confirm("确认删除吗?", "提示", {
      type: "warning",
    }).then(() => {
      request
        .post({
          url: "/example/person/delete",
          data: {
            idList: [row.id],
          },
        })
        .then((res) => {
          if (res && res.code == 200) {
            ElMessage.success("删除成功");
            initTable();
          } else {
            ElMessage.error(res.msg || "操作异常");
          }
        });
    });
  } else if (btn == "other") {
    ElMessage.success("其他");
  }
};
const diaBotBtnClick = (btn) => {
  if (btn == "save") {
    const detailInfo = detailRef.value.getFormValue();
    if (!detailInfo) {
      return;
    }
    const url =
      detailType.value == "add"
        ? "/example/person/create"
        : "/example/person/update";
    request
      .post({
        url,
        data: detailInfo,
      })
      .then((res) => {
        if (res && res.code == 200) {
          ElMessage.success("保存成功");
          isDetail.value = false;
          initTable();
        } else {
          ElMessage.error(res.msg || "操作异常");
        }
      });
  } else if (btn == "back") {
    isDetail.value = false;
  }
};
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  padding: 0 10px;
  background-color: var(--c-bg);
}
</style>
