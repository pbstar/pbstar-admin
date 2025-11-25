<script setup>
import { ref, watch } from "vue";
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

const tableData = ref([]);
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

const tableTopBtnClick = () => {
  detailType.value = "add";
  detailInfo.value = {};
  detailInfo.value.webId = getWebId();
  isDetail.value = true;
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
    <p-table :data="tableData">
      <template #column>
        <el-table-column prop="hobby" label="爱好" />
        <el-table-column prop="hobbyDesc" label="爱好描述" />
        <el-table-column
          prop="operation"
          label="操作"
          fixed="right"
          width="160"
        >
          <template #default="{ row }">
            <p-button
              type="primary"
              size="small"
              link
              @click="tableRightBtnClick({ row, btn: 'edit' })"
            >
              编辑
            </p-button>
            <p-button
              type="danger"
              size="small"
              link
              @click="tableRightBtnClick({ row, btn: 'delete' })"
            >
              删除
            </p-button>
          </template>
        </el-table-column>
      </template>
      <template #topLeft>
        <p-button type="primary" @click="tableTopBtnClick()"> 新增 </p-button>
      </template>
    </p-table>

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
