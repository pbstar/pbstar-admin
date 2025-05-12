<script setup>
import { ref, onBeforeMount, watch } from "vue";
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
  { label: "枚举label", key: "label" },
  { label: "枚举value", key: "value" },
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
      url: "/system/enum/getEnumList",
      data: {
        enumId: props.id,
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
        url: "/system/enum/getEnumDetail",
        data: { id: row.id },
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
            url: "/system/enum/deleteEnum",
            data: { idList: [row.id] },
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
      enumId: props.id,
    };
    isDetail.value = true;
  }
};
const diaBotBtnClick = ({ btn }) => {
  if (btn === "save") {
    const url =
      detailType.value == "add"
        ? "/system/enum/createEnum"
        : "/system/enum/updateEnum";
    request
      .post({
        base: "base",
        url,
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

watch(
  () => props.id,
  (newVal, oldVal) => {
    if (newVal) {
      initTable();
    }
  },
);
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
      type="box"
      title="枚举详细详情页"
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
            key: 'label',
            type: 'input',
            label: '枚举label',
          }"
          v-model="detailInfo.label"
        />
        <p-item
          class="dtItem"
          :config="{
            key: 'value',
            type: 'input',
            label: '枚举value',
          }"
          v-model="detailInfo.value"
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
