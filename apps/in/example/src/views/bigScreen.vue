<template>
  <div class="page">
    <div class="box" ref="fitviewRef">
      <div class="content">
        <!-- 大屏内容区域 -->
        <div class="header">
          <div class="left"></div>
          <div class="title">数字化智能管理系统</div>
          <div class="right">
            <img src="@/assets/imgs/msg.png" alt="" />
          </div>
        </div>
        <div class="body">
          <div class="left" ref="echarts1Ref"></div>
          <div class="right">
            <div class="r-top">
              <div class="r-t-left" ref="echarts2Ref"></div>
              <div class="r-t-right" ref="echarts3Ref"></div>
            </div>
            <div class="r-bot" ref="echarts4Ref"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import fitview from "fitview";
import * as echarts from "echarts";

const fitviewRef = ref(null);
const echarts1Ref = ref(null);
const echarts2Ref = ref(null);
const echarts3Ref = ref(null);
const echarts4Ref = ref(null);
const fv = ref(null);

onMounted(() => {
  fv.value = new fitview({ el: fitviewRef.value });
  initEcharts();
});
onBeforeUnmount(() => {
  fv.value && fv.value.api.destroyResize();
});

function initEcharts() {
  // 初始化左侧柱状图
  const chart1 = echarts.init(echarts1Ref.value);
  chart1.setOption({
    title: {
      text: "数据统计",
      left: "center",
      top: "30px",
      textStyle: { color: "#ffffff" },
    },
    grid: {
      top: "80px",
      left: "40px",
      right: "60px",
      bottom: "40px",
      containLabel: true,
    },
    tooltip: {},
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: { lineStyle: { color: "#ffffff" } },
      axisLabel: { color: "#ffffff" },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#ffffff" } },
      axisLabel: { color: "#ffffff" },
      splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.2)" } },
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "bar",
        itemStyle: { color: "#00e5ff" },
        label: { show: true, position: "top", color: "#ffffff" },
      },
    ],
  });

  // 初始化右上折线图
  const chart2 = echarts.init(echarts2Ref.value);
  chart2.setOption({
    grid: {
      top: "80px",
      left: "40px",
      right: "60px",
      bottom: "40px",
      containLabel: true,
    },
    title: {
      text: "趋势分析",
      left: "center",
      top: "30px",
      textStyle: { color: "#ffffff" },
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: { lineStyle: { color: "#ffffff" } },
      axisLabel: { color: "#ffffff" },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#ffffff" } },
      axisLabel: { color: "#ffffff" },
      splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.2)" } },
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: "line",
        smooth: true,
        lineStyle: { width: 3, color: "#00e5ff" },
        itemStyle: { color: "#ffffff" },
        areaStyle: { color: "rgba(0, 229, 255, 0.3)" },
      },
    ],
  });

  // 初始化右下饼图
  const chart3 = echarts.init(echarts3Ref.value);
  chart3.setOption({
    grid: {
      top: "20px",
      left: "40px",
      right: "60px",
      bottom: "300px",
      containLabel: true,
    },
    title: {
      text: "占比分析",
      left: "center",
      top: "30px",
      textStyle: { color: "#ffffff" },
    },
    tooltip: {
      trigger: "item",
      textStyle: { color: "#333333" },
    },
    legend: {
      orient: "vertical",
      right: "center",
      bottom: "30px",
      textStyle: { color: "#ffffff" },
    },
    series: [
      {
        type: "pie",
        radius: "50%",
        data: [
          {
            value: 1048,
            name: "Search Engine",
            itemStyle: { color: "#00e5ff" },
          },
          { value: 735, name: "Direct", itemStyle: { color: "#00b4ff" } },
          { value: 580, name: "Email", itemStyle: { color: "#0082ff" } },
          { value: 484, name: "Union Ads", itemStyle: { color: "#0055ff" } },
          { value: 300, name: "Video Ads", itemStyle: { color: "#002bff" } },
        ],
        label: { color: "#ffffff" },
        labelLine: { lineStyle: { color: "rgba(255, 255, 255, 0.3)" } },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  });

  // 初始化底部表格区域
  const chart4 = echarts.init(echarts4Ref.value);
  chart4.setOption({
    title: {
      text: "详细数据",
      left: "center",
      top: "30px",
      textStyle: { color: "#ffffff" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      textStyle: { color: "#333333" },
    },
    grid: {
      top: "80px",
      left: "40px",
      right: "60px",
      bottom: "40px",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
      axisLine: { lineStyle: { color: "#ffffff" } },
      axisLabel: { color: "#ffffff" },
      splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.2)" } },
    },
    yAxis: {
      type: "category",
      data: ["Brazil", "Indonesia", "USA", "India", "China"],
      axisLine: { lineStyle: { color: "#ffffff" } },
      axisLabel: { color: "#ffffff" },
      splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.2)" } },
    },
    series: [
      {
        type: "bar",
        data: [18203, 23489, 29034, 104970, 131744],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#00e5ff" },
            { offset: 1, color: "#0082ff" },
          ]),
        },
        label: { show: true, position: "right", color: "#ffffff" },
      },
    ],
  });
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: rgb(17, 30, 99);

  .box {
    width: 100%;
    height: 100%;

    .content {
      width: 1920px;
      height: 1080px;
      .header {
        width: 100%;
        height: 100px;
        background-image: url("@/assets/imgs/header.png");
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .header .title {
        font-size: 40px;
        font-weight: bold;
        color: rgb(0, 229, 255);
        line-height: 100px;
        text-align: center;
      }

      .header .left,
      .header .right {
        width: 500px;
      }

      .header .right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 50px;
        color: rgb(0, 229, 255);
      }

      .header .right img {
        width: 30px;
      }

      .body {
        display: flex;
        justify-content: space-between;
        padding-top: 20px;
      }

      .body .left {
        width: 500px;
        height: 940px;
        overflow: hidden;
        background-image: url("@/assets/imgs/body-left-bg.png");
        background-size: 100% 100%;
      }

      .body .right {
        width: 1400px;
        height: 940px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .body .right .r-top {
        width: 100%;
        height: 620px;
        display: flex;
        justify-content: space-between;
      }

      .body .right .r-top .r-t-left {
        width: 1000px;
        height: 100%;
        background-image: url("@/assets/imgs/body-r-t-left.png");
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .body .right .r-top .r-t-right {
        width: 380px;
        height: 100%;
        background-image: url("@/assets/imgs/body-r-t-right.png");
        background-size: 100% 100%;
      }

      .body .right .r-bot {
        width: 100%;
        height: 300px;
        background-image: url("@/assets/imgs/body-r-bot.png");
        background-size: 100% 100%;
      }
    }
  }
}
</style>
