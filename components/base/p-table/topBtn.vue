<template>
  <div class="btns">
    <el-button
      v-for="(item, index) in btns"
      :key="index"
      :type="item.type || 'primary'"
      @click="handleClick(item.key)"
    >
      <img
        v-show="item.key == 'add'"
        src="@Passets/imgs/icons14/add.png"
        alt=""
      />
      <img
        v-show="item.key == 'export'"
        src="@Passets/imgs/icons14/export.png"
        alt=""
      />
      <img
        v-show="item.key == 'import'"
        src="@Passets/imgs/icons14/import.png"
        alt=""
      />
      {{ item.label }}
    </el-button>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  btns: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["btnClick"]);
const btns = ref(props.btns);

const handleClick = (btn) => {
  emit("btnClick", { btn });
};
</script>
<style lang="scss" scoped>
.btns {
  display: flex;
  align-items: center;
  .el-button {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      margin-right: 4px;
    }
  }
}
</style>
