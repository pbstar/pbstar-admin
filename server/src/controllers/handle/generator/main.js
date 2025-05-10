const create = async (json) => {
  let code = "";
  code += await createScript(json);
  code += await createHtml(json);
  code += await createStyle(json);
  return code;
};

const createScript = async (json) => {
  const searchData = [];
  json.fields.forEach((field) => {
    if (!field.showIn.includes("search")) return;
    let obj = {
      label: field.label,
      key: field.key,
      type: field.type,
    };
    if (field.enumType) {
      obj = { ...obj, enumType: field.enumType };
    }
    searchData.push(obj);
  });

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
  import { ref, onBeforeMount } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import request from "@Passets/utils/request";
  import search from "@/components/base/search.vue";
  import PTable from "@Pcomponents/base/p-table/index.vue";
  ${json.detailDiaType === "diadrawer" ? `import diadrawer from "@/components/base/diadrawer.vue";` : ""}
  ${json.detailDiaType === "diapage" ? `import diapage from "@/components/base/diapage.vue";` : ""}
  ${json.detailDiaType === "diabox" ? `import diabox from "@/components/base/diabox.vue";` : ""}
  import Detail from "./components/${json.key}/detail.vue";

  const searchData = ref(${JSON.stringify(searchData)});
  const showSearch = ref(true);
  const searchValue = ref({});
  const tableColumn = ref(${JSON.stringify(tableColumn)});
  const tableData = ref([]);
  const tableRightBtn = ref(["preview", "edit", "delete"]);
  const tableTopBtn = ref(["add", "export"]);
  const pagination = ref({
    pageNumber: 1,
    pageSize: 10,
    total: 0
  });
  const detailType = ref("");
  const detailInfo = ref({});
  const isDetail = ref(false);
  const detailRef = ref(null);

  onBeforeMount(() => {
    initTable();
  });

  const searchFind = (val) => {
    searchValue.value = val;
    pagination.value.pageNumber = 1;
    initTable();
  };

  const searchReset = () => {
    searchValue.value = {};
    pagination.value.pageNumber = 1;
    initTable();
  };

  const paginationChange = (val) => {
    pagination.value.pageNumber = val.pageNumber;
    pagination.value.pageSize = val.pageSize;
    initTable();
  };

  const initTable = () => {
    const params = {
      pageNumber: pagination.value.pageNumber,
      pageSize: pagination.value.pageSize,
      ...searchValue.value
    };
    tableData.value = [];
    request.post("${json.api.list}", params).then((res: any) => {
      if (res && res.code === 200) {
        tableData.value = res.data.records;
        pagination.value.total = res.data.total;
      } else {
        ElMessage.error(res?.msg || "操作异常");
      }
    });
  };

  const tableRightBtnClick = (row, btn) => {
    if (btn === "preview" || btn === "edit") {
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

  const tableTopBtnClick = (btn) => {
    if (btn === "add") {
      detailType.value = "add";
      detailInfo.value = {};
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
      detailInfo.value = detailRef.value.getFormValue();
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
</script>
`;
  return code;
};

const createHtml = async (json) => {
  const topCode = `
<template>
  <div class="fbox">
    <div class="topTab">
      <div class="tabs">
        <div class="tab active">${json.title}</div>
      </div>
      <div class="btn">
        <el-button
          type="primary"
          size="small"
          text
          style="margin-bottom: -8px"
          @click="showSearch = !showSearch"
        >
          {{ showSearch ? "收起" : "查询" }}
        </el-button>
      </div>
    </div>
`;

  const searchCode = `
    <search
      v-show="showSearch"
      :data="searchData"
      @find="searchFind"
      @reset="searchReset"
    />
`;

  const contentCode = `
    <div class="content">
      <p-table
        :column="tableColumn"
        :data="tableData"
        :rightBtn="tableRightBtn"
        :topBtn="tableTopBtn"
        :pagination="pagination"
        showSetting
        tableKey="${json.key}_1"
        @rightBtnClick="tableRightBtnClick"
        @topBtnClick="tableTopBtnClick"
        @paginationChange="paginationChange"
      />
    </div>
`;

  const diaCode = `
    <${json.detailDiaType}
      title="${json.title}详情页"
      v-model="isDetail"
      :botBtn="['save', 'back']"
      @botBtnClick="diaBotBtnClick"
    >
      <Detail
        :type="detailType"
        :info="detailInfo"
        ref="detailRef"
      />
    </${json.detailDiaType}>
`;

  const bottomCode = `
  </div>
</template>
`;

  let code = "";
  code += topCode;
  code += searchCode;
  code += contentCode;
  code += diaCode;
  code += bottomCode;
  return code;
};

const createStyle = async (json) => {
  const code = `
<style scoped lang="scss">
  .fbox {
    width: calc(100% - 20px);
    margin-left: 10px;
    padding: 0 10px;
    background: var(--color-box-bg);
    overflow: hidden;
    
    .topTab {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 42px;
      width: 100%;
      border-bottom: 1px solid var(--color-toptab-border);
      
      .tabs {
        display: flex;
        
        .tab {
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 16px;
          color: var(--color-toptab);
          margin-right: 20px;
        }
        
        .tab.active {
          color: var(--color-toptab-active);
          font-weight: bold;
          border-bottom: 3px solid var(--color-admin-bg);
        }
      }
    }
    
    .content {
      padding-top: 10px;
    }
    
    .detail {
      padding: 0 10px;
      
      .items {
        ${json.detailDiaType === "diabox" ? `padding: 10px 0;` : ""}
        display: flex;
        ${
          json.detailDiaType === "diapage"
            ? `flex-wrap: wrap;`
            : `flex-direction: column;`
        }
        
        .dtItem {
          ${
            json.detailDiaType === "diapage"
              ? `width: 30%; margin-right: 3%;`
              : `width: 100%;`
          }
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
`;
  return code;
};

export default {
  create,
};
