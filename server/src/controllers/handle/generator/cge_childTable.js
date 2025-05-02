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
<script setup lang="ts">
  import { ref, onBeforeMount, watch } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import request from "@/assets/utils/request";
  import tabulation from "@/components/base/tabulation.vue";
  ${json.detailDiaType === "diadrawer" ? `import diadrawer from "@/components/base/diadrawer.vue";` : ""}
  ${json.detailDiaType === "diapage" ? `import diapage from "@/components/base/diapage.vue";` : ""}
  ${json.detailDiaType === "diabox" ? `import diabox from "@/components/base/diabox.vue";` : ""}
  ${json.detailDiaType !== "diabox" ? `import collapse from "@/components/base/collapse.vue";` : ""}
  import formItem from "@/components/base/formItem.vue";

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
      tableTopBtn.value = ["add"];
      tableRightBtn.value = ["edit", "delete"];
      initTable();
    }
  });

  const tableColumn = ref(${JSON.stringify(tableColumn)});
  const tableData = ref([]);
  const tableRightBtn = ref(["edit", "delete"]);
  const tableTopBtn = ref(["add"]);
  const detailType = ref("");
  const detailInfo: any = ref({});
  const isDetail = ref(false);
  
  const initTable = () => {
    const params = {
      pageNumber: 1,
      pageSize: 99999,
      ${json.childTableKey}: props.info.id,
    };
    tableData.value = [];
    request.post("${json.api.list}", params).then((res: any) => {
      if (res && res.code === 200) {
        tableData.value = res.data.records;
      } else {
        ElMessage.error(res?.msg || "操作异常");
      }
    });
  };
  
  const tableRightBtnClick = (row: any, btn: any) => {
    if (btn === "edit") {
      request.get("${json.api.getOne}", { id: row.id }).then((res: any) => {
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
          request.post("${json.api.delete}", [row.id]).then((res: any) => {
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
  
  const tableTopBtnClick = (btn: any) => {
    if (btn === "add") {
      detailType.value = "add";
      detailInfo.value = {
        ${json.childTableKey}: props.info.id,
      };
      isDetail.value = true;
    }
  };
  
  const diaBotBtnClick = (btn: any) => {
    if (btn === "save") {
      let url = "";
      if (detailType.value === "add") {
        url = "${json.api.create}";
      } else if (detailType.value === "edit") {
        url = "${json.api.update}";
      }
      
      request.post(url, detailInfo.value).then((res: any) => {
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
    <tabulation
      :column="tableColumn"
      :data="tableData"
      :rightBtn="tableRightBtn"
      :topBtn="tableTopBtn"
      :showPagination="false"
      @rightBtnClick="tableRightBtnClick"
      @topBtnClick="tableTopBtnClick"
    />
`;

  const diaCode = `
    <${json.detailDiaType}
      title="${json.title}详情页"
      v-model="isDetail"
      :botBtn="['save', 'back']"
      @botBtnClick="diaBotBtnClick"
    >
      ${
        json.detailDiaType === "diapage" || json.detailDiaType === "diadrawer"
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
            :item="{
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
          json.detailDiaType === "diapage" || json.detailDiaType === "diadrawer"
            ? `</collapse>
      </div>`
            : ""
        }
    </${json.detailDiaType}>
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
      json.detailDiaType === "diadrawer" || json.detailDiaType === "diapage"
        ? `.detail {
      padding: 0 10px;`
        : ""
    }
    
    .items {
      ${json.detailDiaType === "diabox" ? `padding: 20px;` : ""}
      display: flex;
      ${
        json.detailDiaType === "diapage"
          ? `flex-wrap: wrap;`
          : `flex-direction: column;`
      }
      
      .dtItem {
        ${
          json.detailDiaType === "diapage"
            ? `width: 260px; margin-right: 10px;`
            : `width: 100%;`
        }
        margin-bottom: 10px;
      }
    }
    ${
      json.detailDiaType === "diadrawer" || json.detailDiaType === "diapage"
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
