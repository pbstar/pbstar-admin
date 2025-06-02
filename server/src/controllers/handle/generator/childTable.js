const create = (json) => {
  let code = "";
  code += createScript(json);
  code += createHtml(json);
  code += createStyle(json);
  return code;
};

const createScript = (json) => {
  const key = json.childKey.charAt(0).toUpperCase() + json.childKey.slice(1);
  const tableColumn = [];
  const formData = [];
  json.fields.forEach((field) => {
    if (field.showIn.includes("table")) {
      let obj = {
        label: field.label,
        key: field.key,
      };
      if (field.enumKey) {
        obj = { ...obj, enumKey: field.enumKey };
      }
      tableColumn.push(obj);
    }
    if (field.showIn.includes("form")) {
      let obj = {
        label: field.label,
        type: field.type,
        key: field.key,
      };
      if (field.enumKey) {
        obj = { ...obj, enumKey: field.enumKey };
      }
      formData.push(obj);
    }
  });

  let code = `
<script setup>
  import { ref, onBeforeMount, watch, nextTick } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import request from "@Passets/utils/request";
  import PTable from "@Pcomponents/base/p-table/index.vue";
  import PDialog from "@Pcomponents/base/p-dialog/index.vue";
  ${json.detailDiaType !== "box" ? `import PCollapse from "@Pcomponents/base/p-collapse/index.vue";` : ""}
  import PForm from "@Pcomponents/base/p-form/index.vue";

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
    tableRightBtn.value = [
      { label: "编辑", key: "edit" },
      { label: "删除", key: "delete" },
    ];
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

  const tableColumn = ref(${JSON.stringify(tableColumn)});
  const tableData = ref([]);
  const tableRightBtn = ref([]);
  const tableTopBtn = ref([]);
  const detailType = ref("");
  const detailInfo = ref({});
  const isDetail = ref(false);
  const formRef = ref(null);
  const formData = ref(${JSON.stringify(formData)});
  
  const initTable = () => {
    tableData.value = [];
    request
      .get({
        base: "${json.apiKey}",
        url: "/${json.apiBase}/${json.key}/get${key}List",
        data: {
          ${json.key}Id: props.id,
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
  const tableRightBtnClick = ({row, btn}) => {
    if (btn === "edit") {
      request.get({
        base: "${json.apiKey}",
        url: "/${json.apiBase}/${json.key}/get${key}Detail",
        data: { id: row.id }
      }).then((res) => {
        if (res && res.code === 200 && res.data) {
          detailType.value = btn;
          detailInfo.value = res.data;
          isDetail.value = true;
          nextTick(() => {
            formRef.value && formRef.value.toChangeValue(res.data);
          });
        } else {
          ElMessage.error(res?.msg || "操作异常");
        }
      });
    } else if (btn === "delete") {
      ElMessageBox.confirm("确认删除吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          request.post({
            base: "${json.apiKey}",
            url: "/${json.apiBase}/${json.key}/delete${key}",
            data: { idList: [row.id] }
          }).then((res) => {
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
  const tableTopBtnClick = ({btn}) => {
    if (btn === "add") {
      detailType.value = "add";
      detailInfo.value = {
        ${json.key}Id: props.id,
      };
      isDetail.value = true;
    }
  };
  const diaBotBtnClick = ({btn}) => {
    if (btn === "save") {
      const url =
        detailType.value == "add"
          ? "/${json.apiBase}/${json.key}/create${key}"
          : "/${json.apiBase}/${json.key}/update${key}";
      const res = formRef.value && formRef.value.getFormValue();
      if (res && res.errMsg) {
        ElMessage.error(res.errMsg);
        return false;
      }
      detailInfo.value = { ...detailInfo.value, ...res.value };
      request.post({
        base: "${json.apiKey}",
        url,
        data: detailInfo.value,
      }).then((res) => {
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
    }
  );
</script>
`;
  return code;
};

const createHtml = (json) => {
  const spanList = [];
  const w100TypeList = ["textarea", "slot"];
  json.fields.forEach((field) => {
    if (!field.showIn.includes("form")) return;
    if (w100TypeList.includes(field.type)) {
      spanList.push(12);
    } else {
      if (json.detailDiaType === "page") {
        spanList.push(4);
      } else {
        spanList.push(12);
      }
    }
  });
  const topCode = `
<template>
  <div class="childBox">
`;

  const contentCode = `
    <p-table
      :column="tableColumn"
      :data="tableData"
      :rightBtn="tableRightBtn"
      :topBtn="tableTopBtn"
      @rightBtnClick="tableRightBtnClick"
      @topBtnClick="tableTopBtnClick"
    />
`;

  const diaCode = `
    <p-dialog
      type="${json.detailDiaType}"
      title="${json.title}详情页"
      v-model="isDetail"
      :botBtn="[
        { label: '保存', key: 'save' },
        { label: '返回', key: 'back' },
      ]"
      @botBtnClick="diaBotBtnClick"
    >
    ${
      json.detailDiaType === "page" || json.detailDiaType === "drawer"
        ? '<div style="padding: 0 10px;"><p-collapse title="基础信息" :isControl="false" :showDownLine="false">'
        : '<div style="padding: 10px 0">'
    }
        <p-form :data="formData" :spanList="${JSON.stringify(spanList)}" ref="formRef"></p-form>
    ${
      json.detailDiaType === "page" || json.detailDiaType === "drawer"
        ? "</p-collapse></div>"
        : "</div>"
    }
    </p-dialog>
`;

  const bottomCode = `
  </div>
</template>
`;

  let code = "";
  code += topCode;
  code += contentCode;
  code += diaCode;
  code += bottomCode;
  return code;
};

const createStyle = (json) => {
  const code = `
<style scoped lang="scss">
  .childBox {
    width: 100%;
    padding-top: 10px;
  }
</style>
`;
  return code;
};

export default {
  create,
};
