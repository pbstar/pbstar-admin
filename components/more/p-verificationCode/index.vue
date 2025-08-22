<template>
  <canvas
    class="captchaCanvas"
    ref="captchaCanvas"
    :width="contentWidth"
    :height="contentHeight"
    @click="generateCaptcha"
  ></canvas>
</template>
<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  identifyCodes: {
    type: String,
    default: "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  },
  fontSizeMin: {
    type: Number,
    default: 24,
  },
  fontSizeMax: {
    type: Number,
    default: 28,
  },
  backgroundColorMin: {
    type: Number,
    default: 200,
  },
  backgroundColorMax: {
    type: Number,
    default: 220,
  },
  contentWidth: {
    type: Number,
    default: 100,
  },
  contentHeight: {
    type: Number,
    default: 30,
  },
});

const emit = defineEmits(["changeCode"]);
const captchaCanvas = ref(null);
const identifyCode = ref("");

const randomNum = (min, max) => Math.floor(Math.random() * (max - min) + min);

const randomColor = (min, max) => {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return `rgb(${r},${g},${b})`;
};

const makeCode = (chars, length) => {
  identifyCode.value = "";
  for (let i = 0; i < length; i++) {
    identifyCode.value += chars[randomNum(0, chars.length)];
  }
  emit("changeCode", identifyCode.value);
};

const drawText = (ctx, txt, i) => {
  ctx.fillStyle = randomColor(50, 160);
  ctx.font = `${randomNum(props.fontSizeMin, props.fontSizeMax)}px SimHei`;
  const x =
    (i + 1) * ((props.contentWidth - 10) / (identifyCode.value.length + 1));
  const y = randomNum(props.fontSizeMax, props.contentHeight - 5);
  const deg = randomNum(-30, 30);

  ctx.translate(x, y);
  ctx.rotate((deg * Math.PI) / 180);
  ctx.fillText(txt, 0, 0);
  ctx.rotate((-deg * Math.PI) / 180);
  ctx.translate(-x, -y);
};

const drawLine = (ctx) => {
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = randomColor(100, 200);
    ctx.beginPath();
    ctx.moveTo(
      randomNum(0, props.contentWidth),
      randomNum(0, props.contentHeight),
    );
    ctx.lineTo(
      randomNum(0, props.contentWidth),
      randomNum(0, props.contentHeight),
    );
    ctx.stroke();
  }
};

const drawDot = (ctx) => {
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = randomColor(0, 255);
    ctx.beginPath();
    ctx.arc(
      randomNum(0, props.contentWidth),
      randomNum(0, props.contentHeight),
      1,
      0,
      2 * Math.PI,
    );
    ctx.fill();
  }
};

const generateCaptcha = () => {
  makeCode(props.identifyCodes, 4);
  const ctx = captchaCanvas.value.getContext("2d");
  ctx.textBaseline = "bottom";

  ctx.fillStyle = randomColor(
    props.backgroundColorMin,
    props.backgroundColorMax,
  );
  ctx.fillRect(0, 0, props.contentWidth, props.contentHeight);

  for (let i = 0; i < identifyCode.value.length; i++) {
    drawText(ctx, identifyCode.value[i], i);
  }

  drawLine(ctx);
  drawDot(ctx);
};

onMounted(() => {
  generateCaptcha();
});
</script>
<style scoped lang="scss">
.captchaCanvas {
  background-color: #fff;
  cursor: pointer;
}
</style>
