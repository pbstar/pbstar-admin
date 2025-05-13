const create = (json) => {
  let code = "";
  code += createScript(json);
  code += createHtml(json);
  code += createStyle();
  return code;
};

const createScript = (json) => {
  const searchData = [];
  const tableColumn = [];
  json.fields.forEach((field) => {
    if (field.showIn.includes("search")) {
      let objS = {
        label: field.label,
        key: field.key,
        type: field.type,
      };
      if (field.enumKey) {
        objS = { ...objS, enumKey: field.enumKey };
      }
      searchData.push(objS);
    }
    if (field.showIn.includes("table")) {
      let objT = {
        label: field.label,
        key: field.key,
      };
      if (field.enumKey) {
        objT = { ...objT, enumKey: field.enumKey };
      }
      tableColumn.push(objT);
    }
  });

  let code = `
<script setup>
  import { ref, onBeforeMount } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import request from "@Passets/utils/request";
  import PTable from "@Pcomponents/base/p-table/index.vue";
  import PSearch from "@Pcomponents/base/p-search/index.vue";
  import PTitle from "@Pcomponents/base/p-title/index.vue";
  import PDialog from "@Pcomponents/base/p-dialog/index.vue";
  import Detail from "./components/${json.key}/detail.vue";

  const searchData = ref(${JSON.stringify(searchData)});
  const showSearch = ref(true);
  const searchValue = ref({});
  const tableColumn = ref(${JSON.stringify(tableColumn)});
  const tableData = ref([]);
    const tableTopBtn = ref([
    { key: "add", label: "新增" },
  ]);
  const tableRightBtn = ref([
    { key: "view", label: "查看" },
    { key: "edit", label: "编辑" },
    { key: "delete", label: "删除" },
  ]);
  const pagination = ref({
    pageNumber: 1,
    pageSize: 10,
    total: 0
  });
  const detailType = ref("");
  const detailId = ref("");
  const isDetail = ref(false);
  const detailRef = ref(null);

  onBeforeMount(() => {
    initTable();
  });

  const toSearch = ({ data }) => {
    searchValue.value = data;
    initTable();
  };
  const tablePaginationChange = ({ pageNumber, pageSize }) => {
    pagination.value.pageNumber = pageNumber;
    pagination.value.pageSize = pageSize;
    initTable();
  };
  const initTable = () => {
    const params = {
      pageNumber: pagination.value.pageNumber,
      pageSize: pagination.value.pageSize,
      ...searchValue.value
    };
    tableData.value = [];
    request.post({
      base: "${json.apiBase}",
      url: "${json.api.list}",
      data: params
    }).then((res) => {
      if (res && res.code === 200) {
        tableData.value = res.data.list;
        pagination.value.total = res.data.total;
      } else {
        ElMessage.error(res?.msg || "操作异常");
      }
    });
  };
  const tableRightBtnClick = ({row, btn}) => {
    if (btn == "view" || btn == "edit") {
      detailType.value = btn;
      detailId.value = row.id;
      isDetail.value = true;
    } else if (btn === "delete") {
      ElMessageBox.confirm("确认删除吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          request.post({
            base: "${json.apiBase}",
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
  const tableTopBtnClick = ({btn}) => {
    if (btn == "add") {
      detailType.value = "add";
      detailId.value = "";
      isDetail.value = true;
    }
  };
  const diaBotBtnClick = ({btn}) => {
    if (btn === "save") {
      const detailInfo = detailRef.value.getFormValue();
      const url =
        detailType.value == "add"
          ? "${json.api.create}"
          : "${json.api.update}";
      request
        .post({
          base: "${json.apiBase}",
          url,
          data: detailInfo,
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
`;
  return code;
};

const createHtml = (json) => {
  const topCode = `
<template>
  <div class="page">
    <p-title :list="['${json.title}']">
      <el-button
        type="primary"
        size="small"
        text
        style="margin-bottom: -8px"
        @click="showSearch = !showSearch"
      >
        {{ showSearch ? "收起" : "查询" }}
      </el-button>
    </p-title>
`;

  const searchCode = `
    <p-search
      v-show="showSearch"
      style="margin-top: 10px"
      :data="searchData"
      @btnClick="toSearch"
    ></p-search>
`;

  const contentCode = `
    <p-table
      style="margin-top: 10px"
      :data="tableData"
      :column="tableColumn"
      :topBtn="tableTopBtn"
      :rightBtn="tableRightBtn"
      tableKey="${json.key}_1"
      showSetting
      :pagination="pagination"
      @paginationChange="tablePaginationChange"
      @topBtnClick="tableTopBtnClick"
      @rightBtnClick="tableRightBtnClick"
    ></p-table>
`;

  const diaCode = `
    <p-dialog
      title="${json.title}详情页"
      type="${json.detailDiaType}"
      v-model="isDetail"
      :botBtn="[
        { label: '保存', key: 'save' },
        { label: '返回', key: 'back' },
      ]"
      @botBtnClick="diaBotBtnClick"
    >
      <Detail ref="detailRef" :type="detailType" :id="detailId"></Detail>
    </p-dialog>
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

const createStyle = () => {
  const code = `
<style scoped lang="scss">
.page {
  width: 100%;
  padding: 0 10px;
  background-color: var(--c-bg);
}
</style>
`;
  return code;
};

export default {
  create,
};
