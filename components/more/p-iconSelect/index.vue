<template>
  <el-input
    v-model="input"
    placeholder="请选择图标"
    readonly
    @click="visible = true"
  >
    <template #prefix>
      <p-icon :name="input" />
    </template>
  </el-input>
  <p-dialog
    :title="props.title"
    v-model="visible"
    type="box"
    :botBtn="botBtnList"
    @botBtnClick="dialogBotBtnClick"
  >
    <el-tabs v-model="iconType">
      <el-tab-pane label="Element Plus" name="1">
        <div class="icon-list">
          <div
            v-for="(icon, index) in elList"
            :key="index"
            class="icon-item"
            @click="selectIcon('el-icon-' + icon)"
          >
            <p-icon :name="'el-icon-' + icon" />
            <span>{{ "el-icon-" + icon }}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Iconfont" name="2">
        <div class="icon-list">
          <!-- Iconfont icons will be added here -->
        </div>
      </el-tab-pane>
    </el-tabs>
  </p-dialog>
</template>
<script setup>
import { ref, watch } from "vue";
import PIcon from "../../base/p-icon/index.vue";
import PDialog from "../../base/p-dialog/index.vue";
import * as ElIcons from "@element-plus/icons-vue";

const props = defineProps({
  title: {
    type: String,
    default: "选择图标",
  },
  modelValue: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue"]);
const visible = ref(false);
const input = ref(props.modelValue);
const iconType = ref("1");
const botBtnList = ref([
  {
    label: "保存",
    key: "save",
  },
  {
    label: "返回",
    key: "back",
  },
]);
const elList = ref(Object.keys(ElIcons));
const dialogBotBtnClick = ({ key }) => {
  if (key === "save") {
    visible.value = false;
  } else {
    visible.value = false;
  }
};
const selectIcon = (name) => {
  input.value = name;
  emit("update:modelValue", name);
};
watch(
  () => props.modelValue,
  (newVal) => {
    input.value = newVal;
  },
);
</script>
<style scoped lang="scss">
.icon-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: border-color 0.3s;

  &:hover {
    border-color: #409eff;
  }
}
</style>
