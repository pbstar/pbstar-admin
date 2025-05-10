<script setup>
import { ref, onBeforeMount, watch } from "vue";
import { cloneDeep } from "es-toolkit/object";
import { ElMessage, ElMessageBox } from "element-plus";
import PTable from "@Pcomponents/base/p-table/index.vue";
import PDialog from "@Pcomponents/base/p-dialog/index.vue";
import PItem from "@Pcomponents/base/p-item/index.vue";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["update:modelValue", "change"]);

onBeforeMount(() => {
  if (props.type == "view") {
    tableTopBtn.value = [];
    tableRightBtn.value = [];
  } else {
    tableTopBtn.value = [{ label: "新增", key: "add" }];
    tableRightBtn.value = [
      { label: "编辑", key: "edit" },
      { label: "删除", key: "delete" },
    ];
  }
});

const tableColumn = ref([
  { label: "爱好", key: "hobby" },
  { label: "爱好描述", key: "hobbyDesc" },
]);
const tableData = ref([]);
const tableRightBtn = ref([]);
const tableTopBtn = ref([]);
const detailType = ref("");
const detailInfo = ref({});
const isDetail = ref(false);

const getWebId = () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return "webId_" + timestamp + "_" + randomNum;
};
const handleChange = (val) => {
  let arr = cloneDeep(val);
  arr.forEach((item) => {
    if (item["webId"]) {
      delete item["webId"];
    }
  });
  emit("update:modelValue", arr);
  emit("change", arr);
};

const tableRightBtnClick = ({ row, btn }) => {
  if (btn === "edit") {
    detailType.value = btn;
    const index = tableData.value.findIndex((item) => {
      return item.webId == row.webId;
    });
    if (index > -1) {
      detailInfo.value = cloneDeep(tableData.value[index]);
    }
    isDetail.value = true;
  } else if (btn === "delete") {
    ElMessageBox.confirm("确认删除吗?", "提示", {
      type: "warning",
    })
      .then(() => {
        const index = tableData.value.findIndex((item) => {
          return item.webId == row.webId;
        });
        if (index > -1) {
          tableData.value.splice(index, 1);
          handleChange(tableData.value);
        }
      })
      .catch(() => {});
  }
};

const tableTopBtnClick = ({ btn }) => {
  if (btn === "add") {
    detailType.value = "add";
    detailInfo.value = {};
    detailInfo.value.webId = getWebId();
    isDetail.value = true;
  }
};

const diaBotBtnClick = ({ btn }) => {
  if (btn === "save") {
    if (detailType.value === "add") {
      tableData.value.push(detailInfo.value);
    } else if (detailType.value === "edit") {
      const index = tableData.value.findIndex((item) => {
        return item.webId == detailInfo.value.webId;
      });
      if (index > -1) {
        tableData.value[index] = detailInfo.value;
      }
    }
    handleChange(tableData.value);
    isDetail.value = false;
  } else if (btn === "back") {
    isDetail.value = false;
  }
};

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal && newVal.length > 0) {
      tableData.value = cloneDeep(newVal);
      tableData.value.forEach((item) => {
        if (!item.webId) {
          item.webId = getWebId();
        }
      });
    } else {
      tableData.value = [];
    }
  },
  {
    deep: true,
    immediate: true,
  }
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
      title="爱好详情页"
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
            label: '爱好',
          }"
          v-model="detailInfo.hobby"
        />
        <p-item
          class="dtItem"
          :config="{
            type: 'textarea',
            label: '爱好描述',
          }"
          v-model="detailInfo.hobbyDesc"
        />
      </div>
    </p-dialog>
  </div>
</template>

<style scoped lang="scss">
.box {
  width: 100%;

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
