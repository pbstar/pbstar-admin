<template>
  <!-- Box 类型对话框 -->
  <template v-if="type === 'box'">
    <transition name="dia">
      <div
        class="dialog-overlay box-overlay"
        v-if="dialogVisible"
        :style="{ 'z-index': zIndex }"
      >
        <div
          class="dialog-content box-content"
          :style="{ width: width || '500px' }"
        >
          <DialogHeader :title="title" @close="toClose" />
          <div class="dialog-body box-body">
            <slot></slot>
          </div>
          <DialogFooter
            :type="type"
            :buttons="botBtnList"
            @button-click="handleClickBot"
          />
        </div>
      </div>
    </transition>
  </template>

  <!-- Drawer 类型对话框 -->
  <template v-else-if="type === 'drawer'">
    <transition name="dia">
      <div
        class="dialog-overlay drawer-overlay"
        v-if="dialogVisible"
        :style="overlayStyle"
      ></div>
    </transition>
    <transition name="diadrawer">
      <div
        class="dialog-content drawer-content"
        v-if="dialogVisible"
        :style="drawerStyle"
      >
        <DialogHeader :title="title" @close="toClose" drawer />
        <div class="drawer-top-space"></div>
        <div class="dialog-body drawer-body">
          <div class="drawer-content-wrapper">
            <slot></slot>
          </div>
        </div>
        <DialogFooter
          :type="type"
          :buttons="botBtnList"
          @button-click="handleClickBot"
        />
      </div>
    </transition>
  </template>

  <!-- Page 类型对话框 -->
  <template v-else-if="type === 'page'">
    <transition name="dia">
      <div
        class="dialog-overlay page-overlay"
        v-if="dialogVisible"
        :style="overlayStyle"
      >
        <div class="dialog-content page-content">
          <div class="page-header">
            <p-title :list="[title]">
              <slot name="header"></slot>
            </p-title>
          </div>
          <div class="dialog-body page-body">
            <slot></slot>
          </div>
          <DialogFooter
            :type="type"
            :buttons="botBtnList"
            @button-click="handleClickBot"
          />
        </div>
      </div>
    </transition>
  </template>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import useSharedStore from "@Passets/stores/shared";
import pTitle from "@Pcomponents/base/p-title/index.vue";
import DialogHeader from "./DialogHeader.vue";
import DialogFooter from "./DialogFooter.vue";

const sharedStore = useSharedStore();

const props = defineProps({
  type: {
    type: String,
    default: "box",
    validator: (value) => ["box", "drawer", "page"].includes(value),
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "",
  },
  botBtn: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "botBtnClick"]);

const dialogVisible = ref(props.modelValue);
const zIndex = ref(1000);
const isMobile = computed(() => window.innerWidth <= 700);
const navWidth = computed(() =>
  sharedStore.isFull || isMobile.value ? "0" : "200",
);
const topHeight = computed(() =>
  sharedStore.isFull || isMobile.value ? "0" : "90",
);
const mybtns = ref(sharedStore.userInfo?.btns);
const botBtnList = ref([]);

const overlayStyle = computed(() => ({
  "z-index": zIndex.value,
  width: `calc(100vw - ${navWidth.value}px)`,
  height: `calc(100vh - ${topHeight.value}px)`,
  top: topHeight.value + "px",
}));

const drawerStyle = computed(() => ({
  width: props.width || "400px",
  height: `calc(100vh - ${topHeight.value}px)`,
  top: topHeight.value + "px",
  "z-index": zIndex.value + 1,
}));

watch(
  () => props.botBtn,
  (newVal) => {
    botBtnList.value = newVal.filter(
      (item) =>
        !item.auth ||
        mybtns.value == "all" ||
        mybtns.value?.includes(item.auth),
    );
  },
  { immediate: true },
);

watch(
  () => props.modelValue,
  (newVal) => {
    dialogVisible.value = newVal;
    if (newVal) zIndex.value = sharedStore.getIndex();
  },
);

watch(dialogVisible, (newVal) => {
  emit("update:modelValue", newVal);
});

const toClose = () => (dialogVisible.value = false);
const handleClickBot = (btn) => emit("botBtnClick", { btn });
</script>

<style scoped lang="scss">
/* 通用样式 */
.dia-enter-from,
.dia-leave-to {
  opacity: 0;
}
.dia-enter-active,
.dia-leave-active {
  transition: opacity 0.1s;
}

.diadrawer-enter-from,
.diadrawer-leave-to {
  transform: translateX(100%);
}
.diadrawer-enter-active,
.diadrawer-leave-active {
  transition: transform 0.2s ease;
}

.dialog-body {
  width: 100%;
  overflow-y: auto;
}

/* Box 类型样式 */
.dialog-overlay.box-overlay {
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.dialog-content.box-content {
  max-width: calc(100% - 20px);
  max-height: calc(100% - 20px);
  background: var(--c-bg);
  border-radius: 6px;
  overflow: hidden;
}

.dialog-body.box-body {
  min-height: 200px;
  max-height: calc(100vh - 104px);
  padding-bottom: 20px;
}

/* Drawer 类型样式 */
.dialog-overlay.drawer-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  right: 0;
}

.dialog-content.drawer-content {
  max-width: 100%;
  background-color: var(--c-bg-box);
  position: fixed;
  right: 0;
}

.drawer-top-space {
  width: 100%;
  height: 18px;
  background-color: var(--c-bg-theme);
}

.dialog-body.drawer-body {
  height: calc(100% - 90px);
  margin-top: -18px;

  .drawer-content-wrapper {
    margin-left: 10px;
    width: calc(100% - 20px);
    background-color: var(--c-bg);
    border-radius: 6px;
    min-height: 100%;
    overflow: hidden;
  }
}

/* Page 类型样式 */
.dialog-overlay.page-overlay {
  background-color: var(--c-bg-box);
  position: fixed;
  right: 0;
  padding-left: 10px;
}

.dialog-content.page-content {
  width: calc(100% - 10px);
  height: 100%;
  background-color: var(--c-bg);
}

.page-header {
  width: 100%;
  height: 42px;
  padding: 0 10px;
}

.dialog-body.page-body {
  height: calc(100% - 90px);
  padding: 0 10px;
}
</style>
