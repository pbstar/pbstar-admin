<template>
  <div class="page">
    <p-table
      ref="tableRef"
      :data="data"
      :column="column"
      :topBtn="topBtn"
      :rightBtn="rightBtn"
      tableKey="table1"
      showSetting
      :pagination="pagination"
    ></p-table>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import PTable from "@Pcomponents/base/p-table/index.vue";
const data = ref([
  { name: "张三", age: 18, sex: "男", minzu: "1", isHealthy: "1" },
  { name: "李四", age: 19, sex: "女", minzu: "3", isHealthy: "2" },
]);
const column = ref([
  { key: "name", label: "姓名" },
  { key: "age", label: "年龄", width: 100 },
  { key: "sex", label: "性别", minWidth: 100 },
  { key: "minzu", label: "民族", options: [] },
  { key: "isHealthy", label: "是否健康", enumType: "p_boolean1" },
]);
const topBtn = ref([
  { key: "add", label: "新增" },
  { key: "export", label: "导出" },
]);
const rightBtn = ref([
  { key: "view", label: "查看" },
  { key: "edit", label: "编辑" },
  { key: "delete", label: "删除" },
  { key: "import", label: "导入" },
  { key: "export", label: "导出" },
]);
const tableRef = ref(null);
const pagination = ref({
  total: 100,
  pageSize: 10,
  pageNumber: 1,
});
onMounted(() => {
  tableRef.value.toChangeColumnOptions({
    key: "minzu",
    options: [
      { label: "汉族", value: "1" },
      { label: "苗族", value: "2" },
      { label: "壮族", value: "3" },
    ],
  });
});
</script>
<style lang="scss">
.page {
  width: 100%;
  padding: 0 10px;
  background-color: var(--c-bg);
}
</style>
