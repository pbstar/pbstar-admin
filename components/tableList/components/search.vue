<template>
  <div class="search">
    <div class="searchTop">搜索条件</div>
    <div class="searchBox">
      <div class="item" v-for="(item, index) in props.searchList" :key="index">
        <div class="label">{{ item.label }}：</div>
        <div class="value">
          <Dom :item="item" />
        </div>
      </div>
      <div class="item" style="width: 180px"></div>
      <div class="searchBtn">
        <t-button style="margin-right: 10px" @click="toSearch">搜索</t-button>
        <t-button variant="outline" @click="toReset">重置</t-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import Dom from "./dom.vue";
const props = defineProps({
  searchList: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["toSearch"]);
const toSearch = () => {
  let param = {};
  props.searchList.forEach((item) => {
    param[item.key] = item.value;
  });
  emit("toSearch", param);
};
const toReset = () => {
  props.searchList.forEach((item) => {
    item.value = "";
  });
  emit("toSearch", {});
};
</script>
<style scoped lang="scss">
.search {
  padding: 10px 0;
  .searchTop {
    height: 16px;
    line-height: 16px;
    font-size: 14px;
    margin-left: 12px;
    margin-top: 7px;
    margin-bottom: 5px;
    padding-left: 7px;
    border-left: 4px solid #0052d9;
    color: #333;
  }
  .searchBox {
    display: flex;
    flex-wrap: wrap;
    position: relative;

    .item {
      width: 280px;
      height: 32px;
      display: flex;
      align-items: center;
      margin: 7px;
      .label {
        width: 80px;
        font-size: 14px;
        color: #333;
        text-align: right;
      }
      .value {
        width: 200px;
      }
    }
    .searchBtn {
      position: absolute;
      right: 50px;
      bottom: 7px;
    }
  }
}
</style>
