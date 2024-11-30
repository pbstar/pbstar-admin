<template>
  <div class="table">
    <pTableList
      :searchList="searchList"
      :topBtnList="topBtnList"
      :tableList="tableList"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";
const searchList = ref([
  {
    label: "姓名",
    dom: "t-input",
    key: "name",
    value: "",
    bind: {
      placeholder: "请输入姓名",
    },
  },
  {
    label: "用户名",
    dom: "t-input",
    key: "username",
    value: "",
    bind: {
      placeholder: "请输入用户名",
    },
  },
  {
    label: "手机号",
    dom: "t-input",
    key: "phone",
    value: "",
    bind: {
      placeholder: "请输入手机号",
    },
  },
  {
    label: "状态",
    dom: "t-select",
    key: "status",
    value: "",
    bind: {
      placeholder: "请选择状态",
      options: [
        {
          label: "正常",
          value: 1,
        },
        {
          label: "禁用",
          value: 2,
        },
      ],
    },
    on: {
      change: (val) => {
        console.log(val);
      },
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
  { colKey: "name", title: "姓名" },
  { colKey: "username", title: "用户名" },
  { colKey: "phone", title: "手机号" },
  { colKey: "roleName", title: "角色" },
  {
    colKey: "status",
    title: "状态",
    slotName: "status",
    slotList: [
      {
        dom: "t-tag",
        contentFn: (row) => {
          return row.status === 1 ? "正常" : "禁用";
        },
        bind: {
          shape: "round",
          variant: "light-outline",
        },
        bindFn: {
          theme: (row) => {
            return row.status === 1 ? "success" : "danger";
          },
        },
      },
    ],
  },
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
