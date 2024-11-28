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
const props = defineProps({
  tableList: {
    type: Array,
    default: () => [],
  },
});
const slots = ref([]);
slots.value = props.tableList.filter((item) => item.slotName);
const data = [];
const total = 28;
for (let i = 0; i < total; i++) {
  data.push({
    index: i + 1,
  });
}

const pagination = {
  defaultCurrent: 1,
  defaultPageSize: 5,
  total,
};
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
