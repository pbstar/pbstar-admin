<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import pTitle from "@Pcomponents/base/p-title/index.vue";
import pItem from "@Pcomponents/base/p-item/index.vue";
import pTable from "@Pcomponents/base/p-table/index.vue";
import pDialog from "@Pcomponents/base/p-dialog/index.vue";
import pCollapse from "@Pcomponents/base/p-collapse/index.vue";
import pCodeView from "@Pcomponents/more/p-codeView/index.vue";
import request from "@Passets/utils/request";
import { getNowTime } from "@Passets/utils/time";
import { cloneDeep } from "es-toolkit/object";
onBeforeMount(() => {
  historyList.value = JSON.parse(
    localStorage.getItem("p_codeGenerator") || "[]",
  );
  if (historyList.value.length > 0) {
    info.value = cloneDeep(historyList.value[0].info);
  }
});
const tableColumn = ref([
  { label: "key", key: "key" },
  { label: "label", key: "label" },
  { label: "type", key: "type" },
  { label: "showIn", key: "showIn" },
  { label: "enumType", key: "enumType" },
]);
const defaultInfo = {
  key: "",
  template: "main",
  childTableKey: "",
  title: "",
  apiBase: "",
  api: {
    list: "",
    create: "",
    update: "",
    delete: "",
    getOne: "",
  },
  detailDiaType: "page",
  fields: [],
};
const info = ref(cloneDeep(defaultInfo));
const tableRightBtn = ref([
  { label: "编辑", key: "edit" },
  { label: "删除", key: "delete" },
]);
const tableTopBtn = ref([
  { label: "添加", key: "add" },
  { label: "生成", key: "create" },
  { label: "重置", key: "reset" },
  { label: "重置字段", key: "resetFields" },
  { label: "生成历史", key: "history" },
]);
const isDetail = ref(false);
const detailInfo = ref({});
const historyList = ref([]); // 生成历史列表
const isHistory = ref(false); // 是否显示生成历史
const detailType = ref("");
const isCodeView = ref(false); // 是否显示代码查看
const codeList = ref([]); // 代码

const detailDiaTypeList = computed(() => {
  if (info.value.template === "main") {
    return [
      { label: "box", value: "box" },
      { label: "drawer", value: "drawer" },
      { label: "page", value: "page" },
    ];
  } else {
    return [
      { label: "box", value: "box" },
      { label: "drawer", value: "drawer" },
    ];
  }
});

const tableRightBtnClick = ({ row, btn }) => {
  if (btn == "edit") {
    detailInfo.value = row;
    detailType.value = "edit";
    isDetail.value = true;
  } else if (btn == "delete") {
    ElMessageBox.confirm("确认删除吗?", "提示", {
      type: "warning",
    }).then(() => {
      info.value.fields = info.value.fields.filter(
        (item) => item.key !== row.key,
      );
    });
  }
};
const diadrawerBotBtnClick = ({ btn }) => {
  if (btn == "save") {
    if (!detailInfo.value.key) {
      ElMessage.error("请输入key");
      return;
    }
    if (!detailInfo.value.type) {
      ElMessage.error("请输入type");
      return;
    }
    if (detailType.value == "add") {
      info.value.fields.push(detailInfo.value);
    } else if (detailType.value == "edit") {
      const index = info.value.fields.findIndex(
        (item) => item.key == detailInfo.value.key,
      );
      if (index !== -1) {
        info.value.fields[index] = detailInfo.value;
      } else {
        info.value.fields.push(detailInfo.value);
      }
    }
    isDetail.value = false;
  } else if (btn == "back") {
    isDetail.value = false;
  }
};
const tableTopBtnClick = ({ btn }) => {
  if (btn == "add") {
    detailInfo.value = {
      key: "",
      label: "",
      type: "input",
      showIn: ["table", "form"],
      enumType: "",
    };
    detailType.value = "add";
    isDetail.value = true;
  } else if (btn == "create") {
    if (!info.value.template) {
      ElMessage.error("请选择模板");
      return;
    }
    if (info.value.template === "childTable" && !info.value.childTableKey) {
      ElMessage.error("请输入childTableKey");
      return;
    }
    if (!info.value.key) {
      ElMessage.error("请输入key");
      return;
    }
    if (!info.value.title) {
      ElMessage.error("请输入title");
      return;
    }
    if (
      info.value.template === "main" ||
      info.value.template === "childTable"
    ) {
      if (!info.value.api.list) {
        ElMessage.error("请输入列表接口");
        return;
      }
    }
    if (
      info.value.template === "childTable" ||
      info.value.template === "formTable"
    ) {
      if (info.value.detailDiaType === "page") {
        ElMessage.error("请选择详情页类型");
        return;
      }
    }
    if (info.value.fields.length === 0) {
      ElMessage.error("请添加字段");
      return;
    }
    ElMessageBox.confirm("确认生成吗?", "提示", {
      type: "warning",
    }).then(() => {
      let time = getNowTime("yyyy-mm-dd hh:mm:ss");
      historyList.value.unshift({
        info: info.value,
        name: info.value.title + "_" + info.value.template + "_" + time,
      });
      localStorage.setItem(
        "p_codeGenerator",
        JSON.stringify(historyList.value),
      );
      request
        .post({
          base: "base",
          url: "/system/generator",
          data: info.value,
        })
        .then((res) => {
          if (res && res.code == 200) {
            codeList.value = res.data;
            isCodeView.value = true;
            ElMessage.success(res.msg || "操作成功");
          } else {
            ElMessage.error(res.msg || "操作异常");
          }
        });
    });
  } else if (btn == "reset") {
    info.value = cloneDeep(defaultInfo);
  } else if (btn == "history") {
    isHistory.value = true;
  } else if (btn == "resetFields") {
    info.value.fields = [];
  }
};
const toHistoryDel = (row) => {
  ElMessageBox.confirm("确认删除吗?", "提示", {
    type: "warning",
  }).then(() => {
    historyList.value = historyList.value.filter(
      (item) => item.name !== row.name,
    );
    localStorage.setItem("p_codeGenerator", JSON.stringify(historyList.value));
  });
};
const toHistoryUse = (row) => {
  info.value = cloneDeep(row.info);
  isHistory.value = false;
};
</script>
<template>
  <div class="fbox">
    <p-title :list="['代码生成器']"></p-title>
    <div class="content">
      <div class="top">
        <div class="tRow">
          <p-item
            class="item"
            :config="{
              type: 'select',
              label: '模板',
              placeholder: '请选择模板',
              options: [
                { label: 'main', value: 'main' },
                { label: 'childTable', value: 'childTable' },
                { label: 'formTable', value: 'formTable' },
              ],
            }"
            v-model="info.template"
          >
          </p-item>
          <p-item
            class="item"
            :config="{
              type: 'input',
              label: 'key',
              placeholder: '作为唯一标识，请使用英文驼峰命名',
            }"
            v-model="info.key"
          >
          </p-item>
          <p-item
            class="item"
            v-show="info.template === 'childTable'"
            :config="{
              type: 'input',
              label: 'childTableKey',
              placeholder: '子表中关联主表id的字段',
            }"
            v-model="info.childTableKey"
          >
          </p-item>
          <p-item
            class="item"
            :config="{
              type: 'input',
              label: 'title',
              placeholder: '作为页面名称，请使用中文命名',
            }"
            v-model="info.title"
          >
          </p-item>
        </div>
        <div
          class="tRow"
          v-show="info.template === 'main' || info.template === 'childTable'"
        >
          <p-item
            class="item"
            :config="{
              type: 'input',
              label: 'apiBase',
              placeholder: '请输入接口Base',
            }"
            v-model="info.apiBase"
          >
          </p-item>
          <p-item
            class="item"
            :config="{
              type: 'input',
              label: '列表接口',
              placeholder: '请输入获取列表接口地址',
            }"
            v-model="info.api.list"
          >
          </p-item>
          <p-item
            class="item"
            :config="{
              type: 'input',
              label: '新增接口',
              placeholder: '请输入创建接口地址',
            }"
            v-model="info.api.create"
          >
          </p-item>
          <p-item
            class="item"
            :config="{
              type: 'input',
              label: '修改接口',
              placeholder: '请输入更新接口地址',
            }"
            v-model="info.api.update"
          >
          </p-item>
          <p-item
            class="item"
            :config="{
              type: 'input',
              label: '删除接口',
              placeholder: '请输入删除接口地址',
            }"
            v-model="info.api.delete"
          >
          </p-item>
          <p-item
            class="item"
            :config="{
              type: 'input',
              label: '详情接口',
              placeholder: '请输入获取单条接口地址',
            }"
            v-model="info.api.getOne"
          >
          </p-item>
        </div>
        <div class="tRow">
          <p-item
            class="item"
            style="width: 400px"
            :config="{
              type: 'radio',
              label: '详情弹框',
              placeholder: '请选择详情弹框类型',
              options: detailDiaTypeList,
            }"
            v-model="info.detailDiaType"
          >
          </p-item>
        </div>
      </div>
      <div class="mid">
        <p-table
          :data="info.fields"
          :column="tableColumn"
          :topBtn="tableTopBtn"
          :rightBtn="tableRightBtn"
          :showSetting="false"
          @rightBtnClick="tableRightBtnClick"
          @topBtnClick="tableTopBtnClick"
        ></p-table>
      </div>
    </div>
    <p-dialog
      type="drawer"
      title="字段详情"
      v-model="isDetail"
      :botBtn="[
        { label: '保存', key: 'save' },
        { label: '返回', key: 'back' },
      ]"
      width="500px"
      @botBtnClick="diadrawerBotBtnClick"
    >
      <div class="detail">
        <p-collapse title="基础信息" :isControl="false" :showDownLine="false">
          <div class="items">
            <p-item
              class="dtItem"
              :config="{
                type: 'input',
                label: 'key',
                placeholder: '请输入',
                isDisabled: detailType === 'edit',
              }"
              v-model="detailInfo.key"
            >
            </p-item>
            <p-item
              class="dtItem"
              :config="{
                type: 'input',
                label: 'label',
                placeholder: '请输入',
              }"
              v-model="detailInfo.label"
            >
            </p-item>
            <p-item
              class="dtItem"
              :config="{
                type: 'radio',
                label: 'type',
                placeholder: '请输入',
                options: [
                  { label: 'input', value: 'input' },
                  { label: 'textarea', value: 'textarea' },
                  { label: 'inputNumber', value: 'inputNumber' },
                  { label: 'select', value: 'select' },
                  { label: 'selectMultiple', value: 'selectMultiple' },
                  { label: 'radio', value: 'radio' },
                  { label: 'checkbox', value: 'checkbox' },
                  { label: 'date', value: 'date' },
                  { label: 'daterange', value: 'daterange' },
                  { label: 'datetime', value: 'datetime' },
                  { label: 'datetimerange', value: 'datetimerange' },
                ],
              }"
              v-model="detailInfo.type"
            >
            </p-item>
            <p-item
              class="dtItem"
              v-if="info.template === 'main'"
              :config="{
                type: 'checkbox',
                label: 'showIn',
                placeholder: '请输入',
                options: [
                  { label: 'table', value: 'table' },
                  { label: 'form', value: 'form' },
                  { label: 'search', value: 'search' },
                ],
              }"
              v-model="detailInfo.showIn"
            >
            </p-item>
            <p-item
              class="dtItem"
              v-if="
                info.template === 'childTable' || info.template === 'formTable'
              "
              :config="{
                type: 'checkbox',
                label: 'showIn',
                placeholder: '请输入',
                options: [
                  { label: 'table', value: 'table' },
                  { label: 'form', value: 'form' },
                ],
              }"
              v-model="detailInfo.showIn"
            >
            </p-item>
            <p-item
              class="dtItem"
              :config="{
                type: 'input',
                label: 'enumType',
                placeholder: '请输入',
              }"
              v-model="detailInfo.enumType"
            >
            </p-item>
          </div>
        </p-collapse>
      </div>
    </p-dialog>
    <p-dialog
      type="drawer"
      title="生成历史"
      v-model="isHistory"
      :botBtn="[{ label: '返回', key: 'back' }]"
      width="500px"
      @botBtnClick="isHistory = false"
    >
      <div class="history">
        <div class="item" v-for="(item, index) in historyList" :key="index">
          <div class="title">
            {{ item.name }}
          </div>
          <div class="btns">
            <el-button type="primary" size="small" @click="toHistoryUse(item)">
              使用
            </el-button>
            <el-button type="primary" size="small" @click="toHistoryDel(item)">
              删除
            </el-button>
          </div>
        </div>
      </div>
    </p-dialog>
    <p-dialog
      type="drawer"
      title="代码详情"
      v-model="isCodeView"
      :botBtn="[{ label: '返回', key: 'back' }]"
      width="800px"
      @botBtnClick="isCodeView = false"
    >
      <div class="detail">
        <p-collapse
          :title="item.fileName"
          v-for="(item, index) in codeList"
          :key="index"
        >
          <p-codeView
            :code="item.fileCode"
            :filename="item.fileName"
          ></p-codeView>
        </p-collapse>
      </div>
    </p-dialog>
  </div>
</template>
<style scoped lang="scss">
.fbox {
  width: 100%;
  padding: 0 10px;
  background-color: var(--c-bg);
  .content {
    padding-top: 10px;
    .top {
      display: flex;
      flex-direction: column;
      .tRow {
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 310px;
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
  .detail {
    padding: 0 10px;
    .items {
      display: flex;
      flex-direction: column;
      .dtItem {
        width: 100%;
        margin-bottom: 10px;
      }
    }
  }
  .history {
    padding: 10px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      :deep(.el-button) {
        width: 46px;
      }
      border-bottom: 1px solid var(--c-border);
      padding-bottom: 5px;
      margin-bottom: 5px;
    }
  }
}
</style>
