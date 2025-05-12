<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import PTable from "@Pcomponents/base/p-table/index.vue";
import PDialog from "@Pcomponents/base/p-dialog/index.vue";
import PItem from "@Pcomponents/base/p-item/index.vue";

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

onBeforeMount(() => {
  if (props.type == "add") {
    tableTopBtn.value = [];
    tableRightBtn.value = [];
  } else if (props.type == "view") {
    tableTopBtn.value = [];
    tableRightBtn.value = [];
    initTable();
  } else {
    tableTopBtn.value = [{ label: "新增", key: "add" }];
    tableRightBtn.value = [
      { label: "编辑", key: "edit" },
      { label: "删除", key: "delete" },
    ];
    initTable();
  }
});

const tableColumn = ref([
  { label: "名称", key: "eduName" },
  { label: "时间", key: "dateRange" },
  { label: "备注", key: "remark" },
]);
const tableData = ref([]);
const tableRightBtn = ref([]);
const tableTopBtn = ref([]);
const detailType = ref("");
const detailInfo = ref({});
const isDetail = ref(false);

const initTable = () => {
  tableData.value = [];
  request
    .get({
      base: "base",
      url: "/example/test/getEducationList",
      data: {
        testId: props.id,
      },
    })
    .then((res) => {
      if (res && res.code === 200) {
        tableData.value = res.data;
      } else {
        ElMessage.error(res?.msg || "操作异常");
      }
    });
};

const tableRightBtnClick = ({ row, btn }) => {
  if (btn === "edit") {
    request
      .get({
        base: "base",
        url: "/example/test/getEducationDetail",
        data: {
          id: row.id,
        },
      })
      .then((res) => {
        if (res && res.code === 200 && res.data) {
          detailType.value = btn;
          detailInfo.value = res.data;
          isDetail.value = true;
        } else {
          ElMessage.error(res?.msg || "操作异常");
        }
      });
  } else if (btn === "delete") {
    ElMessageBox.confirm("确认删除吗?", "提示", {
      type: "warning",
    })
      .then(() => {
        request
          .post({
            base: "base",
            url: "/example/test/deleteEducation",
            data: {
              idList: [row.id],
            },
          })
          .then((res) => {
            if (res && res.code === 200) {
              initTable();
              ElMessage.success("操作成功");
            } else {
              ElMessage.error(res?.msg || "操作异常");
            }
          });
      })
      .catch(() => {});
  }
};

const tableTopBtnClick = ({ btn }) => {
  if (btn === "add") {
    detailType.value = "add";
    detailInfo.value = {
      testId: props.id,
    };
    isDetail.value = true;
  }
};

const diaBotBtnClick = ({ btn }) => {
  if (btn === "save") {
    let url = "";
    if (detailType.value === "add") {
      url = "/example/test/createEducation";
    } else if (detailType.value === "edit") {
      url = "/example/test/updateEducation";
    }

    request
      .post({
        base: "base",
        url: url,
        data: detailInfo.value,
      })
      .then((res) => {
        if (res && res.code === 200) {
          initTable();
          ElMessage.success("操作成功");
          isDetail.value = false;
        } else {
          ElMessage.error(res?.msg || "操作异常");
        }
      });
  } else if (btn === "back") {
    isDetail.value = false;
  }
};
</script>

<template>
  <div class="box">
    <p-table
      :column="tableColumn"
      :data="tableData"
      :rightBtn="tableRightBtn"
      :topBtn="tableTopBtn"
      @rightBtnClick="tableRightBtnClick"
      @topBtnClick="tableTopBtnClick"
    />

    <p-dialog
      title="教育背景详情页"
      type="box"
      v-model="isDetail"
      :botBtn="[
        { label: '保存', key: 'save' },
        { label: '返回', key: 'back' },
      ]"
      @botBtnClick="diaBotBtnClick"
    >
      <div class="items">
        <p-item
          class="dtItem"
          :config="{
            type: 'input',
            label: '名称',
          }"
          v-model="detailInfo.eduName"
        />
        <p-item
          class="dtItem"
          :config="{
            type: 'daterange',
            label: '时间',
          }"
          v-model="detailInfo.dateRange"
        />
        <p-item
          class="dtItem"
          :config="{
            type: 'textarea',
            label: '备注',
          }"
          v-model="detailInfo.remark"
        />
      </div>
    </p-dialog>
  </div>
</template>

<style scoped lang="scss">
.box {
  width: 100%;
  padding-top: 10px;

  .items {
    padding: 20px;
    display: flex;
    flex-direction: column;

    .dtItem {
      width: 100%;
      margin-bottom: 10px;
    }
  }
}
</style>
