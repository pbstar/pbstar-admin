<template>
  <div class="pTableList">
    <div class="search" v-if="searchList.length">
      <div class="item" v-for="(item, index) in searchList" :key="index">
        <div class="label">{{ item.label }}：</div>
        <div class="input">
          <t-input
            v-model="item.value"
            :placeholder="item.placeholder"
          ></t-input>
        </div>
      </div>
      <div class="item" style="width: 200px;"></div>
      <div class="searchBox">
        <t-button style="margin-right: 10px;">
          搜索
        </t-button>
        <t-button variant="outline">重置</t-button>
      </div>
    </div>
    <div class="line"></div>
    <div class="topBtn"></div>
    <div class="table"></div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
const props = defineProps({
  searchList: {
    type: Array,
    default: [],
  },
  tableList: {
    type: Array,
    default: [],
  },
  getDateUrl: {
    type: String,
    default: "",
  },
  topBtnList: {
    type: Array,
    default: [],
  },
  rowBtnList: {
    type: Array,
    default: [],
  },
});
const emit = defineEmits(["changeCode"]);
onMounted(() => {});
</script>
<style scoped lang="scss">
.pTableList {
  .search {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    padding: 10px 0;
    .item {
      width: 280px;
      height: 32px;
      display: flex;
      align-items: center;
      margin: 10px;
      .label {
        width: 80px;
        font-size: 14px;
        color: #333;
        text-align: right;
      }
      .input {
        width: 200px;
      }
    }
    .searchBox{
      position: absolute;
      right: 50px;
      bottom: 20px;
    }
  }
  .line {
    height: 10px;
    background: #f6f6f6;
  }
  .topBtn {
    height: 50px;
  }
  .table {
    height: 100%;
  }
}
</style>
