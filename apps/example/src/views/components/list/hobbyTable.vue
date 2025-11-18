<script setup>
import { ref, onBeforeMount, watch } from "vue";
import { cloneDeep } from "es-toolkit/object";
import { ElMessageBox } from "element-plus";
import { PTable, PDialog, PForm, PButton } from "@Pcomponents";

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
const formData = ref([
  { label: "爱好", type: "input", key: "hobby" },
  { label: "爱好描述", type: "textarea", key: "hobbyDesc" },
]);

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
    isDetail.value = true;
    if (index > -1) {
      detailInfo.value = cloneDeep(tableData.value[index]);
    }
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

const diaBotBtnClick = (btn) => {
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
  },
);
</script>

<template>
  <div class="childBox">
    <p-table
      :column="tableColumn"
      :data="tableData"
      :rightBtn="tableRightBtn"
      :topBtn="tableTopBtn"
      @rightBtnClick="tableRightBtnClick"
      @topBtnClick="tableTopBtnClick"
    />

    <p-dialog type="box" title="爱好详情页" v-model="isDetail">
      <div style="padding: 10px 0">
        <p-form
          :data="formData"
          :spanList="[12, 12]"
          v-model="detailInfo"
        ></p-form>
      </div>
      <template #footer>
        <p-button type="primary" @click="diaBotBtnClick('save')">
          保存
        </p-button>
        <p-button @click="diaBotBtnClick('back')"> 返回 </p-button>
      </template>
    </p-dialog>
  </div>
</template>

<style scoped lang="scss">
.childBox {
  width: 100%;
}
</style>
