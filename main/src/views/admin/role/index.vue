<template>
  <div class="table">
    <pTableList
      :searchList="searchList"
      :topBtnList="topBtnList"
      :tableList="tableList"
      :getDateUrl="getDateUrl"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";
const getDateUrl = ref("/api/getRoleList");
const searchList = ref([
  {
    label: "角色",
    dom: "t-input",
    key: "name",
    value: "",
    bind: {
      placeholder: "请输入角色",
    },
  },
  {
    label: "键值",
    dom: "t-input",
    key: "key",
    value: "",
    bind: {
      placeholder: "请输入键值",
    },
  },
  {
    label: "创建时间",
    dom: "t-date-range-picker",
    key: "createTime",
    value: [],
    bind: {
      placeholder: "请选择创建时间",
    },
  },
]);
const topBtnList = ref([
  {
    dom: "t-button",
    content: "新增",
    bind: {
      theme: "primary",
    },
    on: {
      click: () => {
        console.log("新增");
      },
    },
  },
  {
    dom: "t-button",
    content: "导出",
    bind: {
      theme: "primary",
    },
    on: {
      click: () => {
        console.log("导出");
      },
    },
  },
]);
const tableList = ref([
  { colKey: "name", title: "角色" },
  { colKey: "key", title: "键值" },
  { colKey: "createTime", title: "创建时间" },
  {
    colKey: "action",
    title: "操作",
    width: 150,
    fixed: "right",
    slotName: "action",
    slotList: [
      {
        dom: "t-button",
        content: "编辑",
        bind: {
          theme: "primary",
          size: "small",
        },
        on: {
          click: (e) => {
            console.log("编辑", e);
          },
        },
      },
      {
        dom: "t-button",
        content: "删除",
        bind: {
          theme: "danger",
          size: "small",
        },
        on: {
          click: (e) => {
            console.log("删除", e);
          },
        },
      },
    ],
  },
]);
</script>
<style scoped></style>