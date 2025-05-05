<template>
  <div class="rightBtn">
    <el-button
      v-for="(item, index) in btns"
      :key="index"
      type="primary"
      size="small"
      link
      @click="handleClick(item.key)"
    >
      {{ item.label }}
    </el-button>
    <el-dropdown
      trigger="click"
      virtual-ref="moreRef"
      v-if="moreBtns.length > 0"
    >
      <el-button
        ref="moreRef"
        style="margin-left: 5px"
        type="primary"
        link
        size="small"
      >
        <span>更多</span>
        <el-icon>
          <arrow-down />
        </el-icon>
      </el-button>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, index) in moreBtns"
            :key="index"
            @click="handleClick(item.key)"
          >
            <span style="font-size: 14px">{{ item.label }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
const props = defineProps({
  btns: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(["btnClick"]);
const btns = ref([]);
const moreBtns = ref([]);
const moreRef = ref(null);

const handleBtn = () => {
  btns.value = [];
  moreBtns.value = [];

  if (props.btns.length > 0) {
    const btnList = [];
    props.btns.forEach((item) => {
      const btn = {};
      btn.key = item.key;
      btn.label = item.label;
      if (
        item.show &&
        typeof item.show == "function" &&
        item.show(props.data)
      ) {
        btnList.push(btn);
      } else if (!item.show && item.show !== false) {
        btnList.push(btn);
      }
    });
    if (btnList.length > 3) {
      btns.value = btnList.slice(0, 2);
      moreBtns.value = btnList.slice(2);
    } else {
      btns.value = btnList;
    }
  }
};

const handleClick = (btn) => {
  emit("btnClick", {
    row: props.data,
    btn,
  });
};
watch(
  () => props.data,
  (newVal, oldVal) => {
    handleBtn();
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<style lang="scss" scoped>
.rightBtn {
  display: flex;
  align-items: center;
  .el-button + .el-button {
    margin-left: 5px;
  }
}
</style>
