<template>
  <div class="page">
    <p-title :list="['Echarts示例']"></p-title>
    <div class="content">
      <div class="item">
        <p-collapse title="柱状图" :isControl="false">
          <div class="itemBox" ref="i1"></div>
        </p-collapse>
      </div>
      <div class="item">
        <p-collapse title="折线图" :isControl="false">
          <div class="itemBox" ref="i2"></div>
        </p-collapse>
      </div>
      <div class="item">
        <p-collapse title="饼图" :isControl="false">
          <div class="itemBox" ref="i3"></div>
        </p-collapse>
      </div>
      <div class="item">
        <p-collapse title="环形图" :isControl="false">
          <div class="itemBox" ref="i4"></div>
        </p-collapse>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import PTitle from "@Pcomponents/base/p-title/index.vue";
import PCollapse from "@Pcomponents/base/p-collapse/index.vue";
import * as echarts from "echarts";
const i1 = ref(null);
const i2 = ref(null);
const i3 = ref(null);
const i4 = ref(null);

onMounted(() => {
  initI1();
  initI2();
  initI3();
  initI4();
});
const initI1 = () => {
  const myChart = echarts.init(i1.value);
  const option = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "bar",
      },
    ],
  };
  myChart.setOption(option);
};

const initI2 = () => {
  const myChart = echarts.init(i2.value);
  const option = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "line",
      },
    ],
  };
  myChart.setOption(option);
};

const initI3 = () => {
  const myChart = echarts.init(i3.value);
  const option = {
    series: [
      {
        type: "pie",
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
      },
    ],
  };
  myChart.setOption(option);
};

const initI4 = () => {
  const myChart = echarts.init(i4.value);
  const option = {
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
      },
    ],
  };
  myChart.setOption(option);
};
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  padding: 0 10px;
  background-color: var(--c-bg);
  .content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
    .item {
      width: 380px;
      height: 300px;
      border: 1px solid var(--c-border);
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 0 10px;
      .itemBox {
        width: 100%;
        height: 238px;
      }
    }
  }
}
</style>
