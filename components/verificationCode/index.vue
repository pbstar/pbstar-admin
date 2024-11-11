<template>
  <canvas class="captchaCanvas" ref="captchaCanvas" :width="contentWidth" :height="contentHeight" @click="generateCaptcha"></canvas>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps({
  identifyCodes: {
    type: String,
    default: "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  },
  fontSizeMin: {
    type: Number,
    default: 25
  },
  fontSizeMax: {
    type: Number,
    default: 35
  },
  backgroundColorMin: {
    type: Number,
    default: 200
  },
  backgroundColorMax: {
    type: Number,
    default: 220
  },
  contentWidth: {
    type: Number,
    default: 100
  },
  contentHeight: {
    type: Number,
    default: 43
  }
})
const emit = defineEmits(['changeCode'])
const captchaCanvas = ref(null);
let identifyCode = ""
onMounted(() => {
  generateCaptcha();
});
const generateCaptcha = () => {
  makeCode(props.identifyCodes, 4)
  let ctx = captchaCanvas.value.getContext('2d');
  ctx.textBaseline = "bottom";
  // 绘制背景
  ctx.fillStyle = randomColor(
    props.backgroundColorMin,
    props.backgroundColorMax
  );
  ctx.fillRect(0, 0, props.contentWidth, props.contentHeight);
  // 绘制文字
  for (let i = 0; i < identifyCode.length; i++) {
    drawText(ctx, identifyCode[i], i);
  }
  drawLine(ctx);
  drawDot(ctx);
  function makeCode(e, n) {
    identifyCode = ""
    for (let i = 0; i < n; i++) {
      identifyCode += e[randomNum(0, e.length)];
    }
    emit('changeCode', identifyCode)
  }
  function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  function randomColor(min, max) {
    let r = randomNum(min, max);
    let g = randomNum(min, max);
    let b = randomNum(min, max);
    return "rgb(" + r + "," + g + "," + b + ")";
  }
  function drawText(ctx, txt, i) {
    ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
    ctx.font =
      randomNum(props.fontSizeMin, props.fontSizeMax) + "px SimHei"; //随机生成字体大小
    let x = (i + 1) * ((props.contentWidth - 10) / (identifyCode.length + 1));
    let y = randomNum(props.fontSizeMax, props.contentHeight - 5);
    var deg = randomNum(-30, 30);
    // 修改坐标原点和旋转角度
    ctx.translate(x, y);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(txt, 0, 0);
    // 恢复坐标原点和旋转角度
    ctx.rotate((-deg * Math.PI) / 180);
    ctx.translate(-x, -y);
  }
  function drawLine(ctx) {
    // 绘制干扰线
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = randomColor(100, 200);
      ctx.beginPath();
      ctx.moveTo(
        randomNum(0, props.contentWidth),
        randomNum(0, props.contentHeight)
      );
      ctx.lineTo(
        randomNum(0, props.contentWidth),
        randomNum(0, props.contentHeight)
      );
      ctx.stroke();
    }
  }
  function drawDot(ctx) {
    // 绘制干扰点
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = randomColor(0, 255);
      ctx.beginPath();
      ctx.arc(
        randomNum(0, props.contentWidth),
        randomNum(0, props.contentHeight),
        1,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  }
};


</script>
<style scoped lang="scss">
.captchaCanvas {
  background-color: #fff;
  cursor: pointer;
}
</style>
