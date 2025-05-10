const create = async (json) => {
  let code = "";
  code += await createScript(json);
  code += await createHtml(json);
  code += await createStyle(json);
  return code;
};

const createScript = async (json) => {
  const tableColumn = [];
  json.fields.forEach((field) => {
    if (!field.showIn.includes("table")) return;
    let obj = {
      label: field.label,
      key: field.key,
    };
    if (field.enumType) {
      obj = { ...obj, enumType: field.enumType };
    }
    tableColumn.push(obj);
  });

  let code = `
<script setup>
  import { ref, onBeforeMount, watch } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import request from "@Passets/utils/request";
  import PTable from "@Pcomponents/base/p-table/index.vue";
  import pDialog from "@Pcomponents/base/p-dialog/index.vue";
  ${json.detailDiaType !== "diabox" ? `import PCollapse from "@Pcomponents/base/p-collapse/index.vue";` : ""}
  import PItem from "@Pcomponents/base/p-item/index.vue";

  const props = defineProps({
    type: {
      type: String,
      default: "",
    },
    info: {
      type: Object,
      default: () => ({}),
    },
  });

  onBeforeMount(() => {
    if (props.type == "add") {
      tableTopBtn.value = [];
      tableRightBtn.value = [];
    } else if (props.type == "preview") {
      tableTopBtn.value = [];
      tableRightBtn.value = [];
      initTable();
    } else {
      tableTopBtn.value = [{ label: "新增", value: "add"}];
      tableRightBtn.value = [{ label: "编辑", value: "edit"}, { label: "删除", value: "delete"}];
      initTable();
    }
  });

  const tableColumn = ref(${JSON.stringify(tableColumn)});
  const tableData = ref([]);
  const tableRightBtn = ref([
    { label: "编辑", value: "edit"},
    { label: "删除", value: "delete"},
  ]);
  const tableTopBtn = ref([
    { label: "新增", value: "add"}
  ]);
  const detailType = ref("");
  const detailInfo = ref({});
  const isDetail = ref(false);
  
  const initTable = () => {
    const params = {
      pageNumber: 1,
      pageSize: 99999,
      ${json.childTableKey}: props.info.id,
    };
    tableData.value = [];
    request.post({
      base: "base",
      url: "${json.api.list}",
      data: params
    }).then((res) => {
      if (res && res.code === 200) {
        tableData.value = res.data.list;
      } else {
        ElMessage.error(res?.msg || "操作异常");
      }
    });
  };
  
  const tableRightBtnClick = (row, btn) => {
    if (btn === "edit") {
      request.get({
        base: "base",
        url: "${json.api.getOne}",
        data: { id: row.id }
      }).then((res) => {
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
          request.post({
            base: "base",
            url: "${json.api.delete}",
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
  
  const tableTopBtnClick = (btn) => {
    if (btn === "add") {
      detailType.value = "add";
      detailInfo.value = {
        ${json.childTableKey}: props.info.id,
      };
      isDetail.value = true;
    }
  };
  
  const diaBotBtnClick = (btn) => {
    if (btn === "save") {
      let url = "";
      if (detailType.value === "add") {
        url = "${json.api.create}";
      } else if (detailType.value === "edit") {
        url = "${json.api.update}";
      }
      
      request.post(url, detailInfo.value).then((res) => {
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
    () => props.info.id,
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

const createHtml = async (json) => {
  const formData = [];
  json.fields.forEach((field) => {
    if (!field.showIn.includes("form")) return;
    let obj = {
      name: field.name,
      label: field.label,
      type: field.type,
      key: field.key,
    };
    if (field.enumType) {
      obj = { ...obj, enumType: field.enumType };
    }
    formData.push(obj);
  });

  const topCode = `
<template>
  <div class="box">
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
        {
          label: '保存',
          key: 'save',
        },
        {
          label: '返回',
          key: 'back',
        },
      ]"
      @botBtnClick="diaBotBtnClick"
    >
      ${
        json.detailDiaType === "page" || json.detailDiaType === "drawer"
          ? `<div class="detail">
          <collapse title="基础信息" :isControl="false" :showDownLine="false">`
          : ""
      }
        <div class="items">
          ${formData
            .map(
              (field) => `
          <formItem
            class="dtItem"
            :config="{
              key: '${field.key}',
              type: '${field.type}',
              label: '${field.label}',
              ${field.enumType ? `enumType: '${field.enumType}',` : ""}
            }"
            v-model="detailInfo.${field.key}"
          />`
            )
            .join("")}
        </div>
        ${
          json.detailDiaType === "page" || json.detailDiaType === "drawer"
            ? `</collapse>
      </div>`
            : ""
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

const createStyle = async (json) => {
  const code = `
<style scoped lang="scss">
  .box {
    width: 100%;
    padding-top: 10px;
    ${
      json.detailDiaType === "drawer" || json.detailDiaType === "page"
        ? `.detail {
      padding: 0 10px;`
        : ""
    }
    
    .items {
      ${json.detailDiaType === "box" ? `padding: 20px;` : ""}
      display: flex;
      ${
        json.detailDiaType === "page"
          ? `flex-wrap: wrap;`
          : `flex-direction: column;`
      }
      
      .dtItem {
        ${
          json.detailDiaType === "page"
            ? `width: 260px; margin-right: 10px;`
            : `width: 100%;`
        }
        margin-bottom: 10px;
      }
    }
    ${
      json.detailDiaType === "drawer" || json.detailDiaType === "page"
        ? `}`
        : ""
    }
  }
</style>
`;
  return code;
};

export default {
  create,
};
