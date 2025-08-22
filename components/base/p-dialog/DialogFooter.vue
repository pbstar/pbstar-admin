<template>
  <div class="dialog-footer" :style="footerStyle">
    <el-button
      v-for="(item, index) in buttons"
      :key="index"
      :type="item.type || 'primary'"
      @click="$emit('button-click', item.key)"
    >
      {{ item.label }}
    </el-button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "box",
  },
  buttons: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["button-click"]);

const footerStyle = computed(() => {
  if (props.type === "drawer") {
    return {
      height: "40px",
      justifyContent: "center",
    };
  } else if (props.type === "page") {
    return {
      height: "48px",
      justifyContent: "center",
    };
  } else if (props.type === "box") {
    return {
      height: "42px",
      backgroundColor: "var(--c-bg-box)",
      justifyContent: "flex-end",
      paddingRight: "10px",
    };
  }
});
</script>
<style lang="scss" scoped>
.dialog-footer {
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
