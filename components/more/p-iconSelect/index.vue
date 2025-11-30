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
    <template #suffix>
      <p-icon name="el-icon-arrow-down" />
    </template>
  </el-input>
  <p-dialog :title="props.title" width="700px" v-model="visible" type="box">
    <div class="box">
      <el-tabs v-model="iconType">
        <el-tab-pane label="Element Plus" name="1">
          <IconList :icons="elList" :active="iconActive" @select="selectIcon" />
        </el-tab-pane>
        <el-tab-pane label="Iconfont" name="2">
          <IconList
            :icons="iconList"
            :active="iconActive"
            @select="selectIcon"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <template #footer>
      <p-button type="primary" @click="handleSave()"> 保存 </p-button>
      <p-button @click="handleBack()"> 返回 </p-button>
    </template>
  </p-dialog>
</template>
<script setup>
import { ref, watch, computed } from "vue";
import PIcon from "../../base/p-icon/index.vue";
import PDialog from "../../base/p-dialog/index.vue";
import PButton from "../../base/p-button/index.vue";
import IconList from "./IconList.vue";
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

const elList = computed(() =>
  Object.keys(ElIcons).map((item) => "el-icon-" + item),
);

const iconList = computed(() =>
  iconJson.glyphs.map((item) => iconJson.css_prefix_text + item.font_class),
);

const openDialog = () => {
  iconActive.value = input.value;
  iconType.value = input.value?.startsWith("p-icon-") ? "2" : "1";
  visible.value = true;
};

const handleSave = () => {
  visible.value = false;
  input.value = iconActive.value;
  emit("update:modelValue", iconActive.value);
};
const handleBack = () => {
  visible.value = false;
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
  height: 560px;
}
</style>
