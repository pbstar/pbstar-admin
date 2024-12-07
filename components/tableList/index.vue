<template>
  <div class="pTableList">
    <Search v-if="searchList.length" :searchList="searchList" @toSearch="toSearch" />
    <div class="line"></div>
    <TopBtn :topBtnList="topBtnList" />
    <Table ref="table" :tableList="tableList" :tableConfig="tableConfig" :getDateUrl="getDateUrl"/>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import Search from "./components/search.vue";
import TopBtn from "./components/topBtn.vue";
import Table from "./components/table.vue";
const props = defineProps({
  searchList: {
    type: Array,
    default: [],
  },
  tableList: {
    type: Array,
    default: [],
  },
  tableConfig: {
    type: Object,
    default: {},
  },
  getDateUrl: {
    type: String,
    default: "",
  },
  topBtnList: {
    type: Array,
    default: [],
  },
});

const table = ref(null);
onMounted(() => {
  table.value.getUserList();
});
const toSearch = (val) => {
  table.value.getUserList(val);
};
</script>
<style scoped lang="scss">
.pTableList {
  .line {
    height: 10px;
    background: #f6f6f6;
  }
  .table {
    height: 100%;
  }
}
</style>
