<template>
  <div class="page">
    <div class="box" ref="fitviewRef">
      <div class="content">
        <!-- 大屏内容区域 -->
        <div class="header">
          <h1>数据大屏</h1>
        </div>
        <div class="dashboard">
          <div class="row">
            <div class="card">
              <h2>销售额</h2>
              <p>￥500,000</p>
            </div>
            <div class="card">
              <h2>利润</h2>
              <p>￥100,000</p>
            </div>
            <div class="card">
              <h2>订单量</h2>
              <p>10,000</p>
            </div>
          </div>
          <div class="row">
            <div class="chart">
              <h2>销售额趋势</h2>
              <div ref="salesChart" style="width: 100%; height: 300px"></div>
            </div>
            <div class="chart">
              <h2>利润趋势</h2>
              <div ref="profitChart" style="width: 100%; height: 300px"></div>
            </div>
          </div>
          <div class="row">
            <div class="table">
              <h2>最新订单</h2>
              <table>
                <thead>
                  <tr>
                    <th>订单号</th>
                    <th>客户</th>
                    <th>金额</th>
                    <th>日期</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1001</td>
                    <td>客户A</td>
                    <td>￥100</td>
                    <td>2025-06-01</td>
                  </tr>
                  <tr>
                    <td>1002</td>
                    <td>客户B</td>
                    <td>￥200</td>
                    <td>2025-06-02</td>
                  </tr>
                  <tr>
                    <td>1003</td>
                    <td>客户C</td>
                    <td>￥300</td>
                    <td>2025-06-03</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="chart">
              <h2>订单量分布</h2>
              <div ref="orderChart" style="width: 100%; height: 300px"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import fitview from "fitview";
import * as echarts from "echarts";

const fitviewRef = ref(null);
const salesChart = ref(null);
const profitChart = ref(null);
const orderChart = ref(null);

onMounted(() => {
  fitviewRef.value && new fitview({ el: fitviewRef.value });
  initEcharts();
});
function initEcharts() {
  // 销售额趋势
  const salesChartInstance = echarts.init(salesChart.value);
  const salesOption = {
    title: {
      text: "销售额趋势",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: ["6月1日", "6月2日", "6月3日", "6月4日", "6月5日"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [10000, 12000, 15000, 18000, 20000],
        type: "line",
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#4bc0c0",
        },
        itemStyle: {
          color: "#4bc0c0",
        },
      },
    ],
  };
  salesChartInstance.setOption(salesOption);

  // 利润趋势
  const profitChartInstance = echarts.init(profitChart.value);
  const profitOption = {
    title: {
      text: "利润趋势",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: ["6月1日", "6月2日", "6月3日", "6月4日", "6月5日"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [2000, 2400, 3000, 3600, 4000],
        type: "line",
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#ff9f40",
        },
        itemStyle: {
          color: "#ff9f40",
        },
      },
    ],
  };
  profitChartInstance.setOption(profitOption);

  // 订单量分布
  const orderChartInstance = echarts.init(orderChart.value);
  const orderOption = {
    title: {
      text: "订单量分布",
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "订单来源",
        type: "pie",
        radius: "70%",
        data: [
          { value: 4000, name: "线上" },
          { value: 3000, name: "线下" },
          { value: 2000, name: "代理商" },
          { value: 1000, name: "其他" },
        ],
        itemStyle: {
          borderRadius: 5,
          borderColor: "#1a1a1a",
          borderWidth: 2,
        },
        label: {
          color: "#ccc",
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  orderChartInstance.setOption(orderOption);
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: #000;

  .box {
    width: 100%;
    height: 100%;

    .content {
      width: 1920px;
      height: 1080px;
      display: flex;
      flex-direction: column;
      background-color: #000;
      color: #ccc;
      padding: 20px;

      .header {
        text-align: center;
        font-size: 40px;
        margin-bottom: 20px;
        color: #4bc0c0; /* 更亮的标题颜色 */
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 添加文字阴影 */
      }

      .dashboard {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .row {
          display: flex;
          gap: 20px;

          .card {
            flex: 1;
            background-color: #1a1a1a;
            padding: 20px;
            border-radius: 10px;
            text-align: center;

            h2 {
              margin-bottom: 10px;
              font-size: 24px;
              color: #ccc; /* 卡片标题颜色 */
            }

            p {
              font-size: 36px;
              font-weight: bold;
              color: #4bc0c0; /* 卡片内容颜色 */
            }
          }

          .chart {
            flex: 1;
            background-color: #1a1a1a;
            padding: 20px;
            border-radius: 10px;

            h2 {
              margin-bottom: 10px;
              font-size: 24px;
              color: #ccc; /* 图表标题颜色 */
            }
          }

          .table {
            flex: 1;
            background-color: #1a1a1a;
            padding: 20px;
            border-radius: 10px;

            h2 {
              margin-bottom: 10px;
              font-size: 24px;
              color: #ccc; /* 表格标题颜色 */
            }

            table {
              width: 100%;
              border-collapse: collapse;

              th,
              td {
                padding: 10px;
                text-align: center;
                border: 1px solid #333;
                color: #ccc; /* 表格文字颜色 */
              }

              th {
                background-color: #222; /* 表头背景颜色 */
              }
            }
          }
        }
      }
    }
  }
}
</style>
