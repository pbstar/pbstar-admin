<template>
  <el-input
    v-model="input"
    placeholder="请选择图标"
    readonly
    @click="openDialog"
  >
    <template #prefix>
      <p-icon :name="input" />
    </template>
  </el-input>
  <p-dialog
    :title="props.title"
    width="700px"
    v-model="visible"
    type="box"
    :botBtn="botBtnList"
    @botBtnClick="dialogBotBtnClick"
  >
    <div class="box">
      <el-tabs v-model="iconType">
        <el-tab-pane label="Element Plus" name="1">
          <div class="icon-list">
            <div
              v-for="(icon, index) in elList"
              :key="index"
              class="icon-item"
              :class="{ active: iconActive == icon }"
              @click="selectIcon(icon)"
            >
              <p-icon class="icon" :name="icon" size="20" />
              <div class="name">{{ icon }}</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Iconfont" name="2">
          <div class="icon-list">
            <div
              v-for="(icon, index) in iconList"
              :key="index"
              class="icon-item"
              :class="{ active: iconActive == icon }"
              @click="selectIcon(icon)"
            >
              <p-icon class="icon" :name="icon" size="20" />
              <div class="name">{{ icon }}</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </p-dialog>
</template>
<script setup>
import { ref, watch } from "vue";
import PIcon from "../../base/p-icon/index.vue";
import PDialog from "../../base/p-dialog/index.vue";
import * as ElIcons from "@element-plus/icons-vue";
import iconJson from "@Passets/iconfont/iconfont.json";

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
const iconActive = ref(props.modelValue);
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
const elList = ref([]);
elList.value = Object.keys(ElIcons).map((item) => "el-icon-" + item);
const iconList = ref([]);
iconList.value = iconJson.glyphs.map(
  (item) => iconJson.css_prefix_text + item.font_class,
);
const openDialog = () => {
  iconActive.value = input.value;
  iconType.value = input.value.startsWith("p-icon-") ? "2" : "1";
  visible.value = true;
};
const dialogBotBtnClick = ({ btn }) => {
  if (btn === "save") {
    visible.value = false;
    input.value = iconActive.value;
    emit("update:modelValue", iconActive.value);
  } else {
    visible.value = false;
  }
};
const selectIcon = (name) => {
  iconActive.value = name;
};
watch(
  () => props.modelValue,
  (newVal) => {
    input.value = newVal;
  },
);
</script>
<style scoped lang="scss">
.box {
  padding: 0 15px;
}
.icon-list {
  display: flex;
  flex-wrap: wrap;
  height: 600px;
  overflow-y: auto;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 15px 5px;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  margin-right: 8px;
  margin-top: 8px;
  width: 158px;
  .icon {
    margin-bottom: 5px;
  }
  .name {
    width: 100%;
    font-size: 13px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover,
  &.active {
    border-color: var(--c-text3);
  }
}
.icon-item:nth-child(4n) {
  margin-right: 0;
}
.icon-item:nth-child(-n + 4) {
  margin-top: 0;
}
</style>
