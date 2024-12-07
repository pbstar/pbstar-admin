<template>
  <div class="table">
    <t-table
      row-key="index"
      :data="data"
      :columns="props.tableList"
      :stripe="true"
      :bordered="true"
      :pagination="pagination"
      cell-empty-content="-"
      :resizable="true"
    >
      <template
        v-for="(item, index) in slots"
        :key="index"
        v-slot:[item.slotName]="{ row }"
      >
        <Dom
          v-for="(item, index) in item.slotList"
          :style="index > 0 ? 'margin-left: 5px' : ''"
          :key="index"
          :item="{ ...item, row }"
        />
      </template>
    </t-table>
  </div>
</template>
<script setup>
import { ref } from "vue";
import Dom from "./dom.vue";
import http from "@PUtils/http";
const props = defineProps({
  tableList: {
    type: Array,
    default: () => [],
  },
  getDateUrl: {
    type: String,
    default: "",
  },
  tableConfig: {
    type: Object,
    default: () => ({}),
  },
});
const slots = ref([]);
slots.value = props.tableList.filter((item) => item.slotName);
const data = ref([]);
const pagination = ref({
  defaultCurrent: 1,
  defaultPageSize: 5,
  total: 0,
});
const config = Object.assign(
  {
    showIndexcolumn: true,
  },
  props.tableConfig
);

if (config.showIndexcolumn) {
  props.tableList.unshift({
    title: "序号",
    colKey: "p_index",
    width: 80,
  });
}
const getUserList = (e) => {
  http
    .get(props.getDateUrl, {
      ...{
        page: pagination.value.defaultCurrent,
        pageSize: pagination.value.defaultPageSize,
      },
      ...e,
    })
    .then((res) => {
      if (res.code === 200) {
        data.value = res.data.list || [];
        data.value.forEach((item, index) => {
          if (config.showIndexcolumn) {
            item.p_index =
              (pagination.value.defaultCurrent - 1) *
                pagination.value.defaultPageSize +
              index +
              1;
          }
        });
        pagination.value.total = res.data.total || 0;
      }
    });
};
defineExpose({
  getUserList,
});
</script>
<style scoped lang="scss">
.table {
  padding: 0 12px;
  :deep(.t-table th),
  :deep(.t-table td) {
    padding: 11px 12px;
  }
  :deep(.t-table--bordered .t-table__pagination) {
    padding-top: 10px;
  }
}
</style>
