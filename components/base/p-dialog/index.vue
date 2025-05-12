<template>
  <!-- Box 类型对话框 -->
  <template v-if="type === 'box'">
    <transition name="dia">
      <div
        class="diaboxF"
        v-if="dialogVisible"
        :style="{
          'z-index': zIndex,
        }"
      >
        <div
          class="diabox"
          :style="{
            width: width || '500px',
          }"
        >
          <div class="header"></div>
          <div class="top">
            <div class="title">{{ title }}</div>
            <img
              src="@Passets/imgs/icons14/close2.png"
              alt=""
              @click="toClose"
            />
          </div>
          <div class="mid">
            <slot></slot>
          </div>
          <div class="bot">
            <el-button
              v-for="(item, index) in botBtn"
              :key="index"
              size="small"
              :type="item.type || 'primary'"
              @click="handleClickBot(item.key)"
            >
              {{ item.label }}
            </el-button>
          </div>
        </div>
      </div>
    </transition>
  </template>

  <!-- Drawer 类型对话框 -->
  <template v-else-if="type === 'drawer'">
    <transition name="dia">
      <div
        class="diadrawerF"
        v-if="dialogVisible"
        :style="{
          'z-index': zIndex,
          width: `calc(100vw - ${navWidth}px)`,
          height: `calc(100vh - ${topHeight}px)`,
          top: topHeight + 'px',
        }"
      ></div>
    </transition>
    <transition name="diadrawer">
      <div
        class="diadrawer"
        v-if="dialogVisible"
        :style="{
          width: width || '400px',
          height: `calc(100vh - ${topHeight}px)`,
          top: topHeight + 'px',
          'z-index': zIndex + 1,
        }"
      >
        <div class="top">
          <div class="tLeft">
            <div class="title">{{ title }}</div>
          </div>
          <div class="tRight">
            <img
              src="@Passets/imgs/icons14/close.png"
              alt=""
              @click="toClose"
            />
          </div>
        </div>
        <div class="top2"></div>
        <div class="mid">
          <div class="midbox">
            <slot></slot>
          </div>
        </div>
        <div class="bot">
          <el-button
            v-for="(item, index) in botBtn"
            :key="index"
            :type="item.type || 'primary'"
            @click="handleClickBot(item.key)"
          >
            {{ item.label }}
          </el-button>
        </div>
      </div>
    </transition>
  </template>

  <!-- Page 类型对话框 -->
  <template v-else-if="type === 'page'">
    <transition name="dia">
      <div
        class="diapageF"
        v-if="dialogVisible"
        :style="{
          'z-index': zIndex,
          width: `calc(100vw - ${navWidth}px)`,
          height: `calc(100vh - ${topHeight}px)`,
          top: topHeight + 'px',
        }"
      >
        <div class="diapage">
          <div class="top">
            <p-title :list="[title]">
              <slot name="header"></slot>
            </p-title>
          </div>
          <div class="mid">
            <slot></slot>
          </div>
          <div class="bot">
            <el-button
              v-for="(item, index) in botBtn"
              :key="index"
              :type="item.type || 'primary'"
              @click="handleClickBot(item.key)"
            >
              {{ item.label }}
            </el-button>
          </div>
        </div>
      </div>
    </transition>
  </template>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import useSharedStore from "@Passets/stores/shared";
import pTitle from "@Pcomponents/base/p-title/index.vue";
const sharedStore = useSharedStore();

const props = defineProps({
  // 对话框类型: box(弹窗), drawer(抽屉), page(页面)
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
  // drawer/box特有属性
  width: {
    type: String,
    default: "",
  },
  // 按钮配置
  botBtn: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "botBtnClick"]);

const dialogVisible = ref(props.modelValue);
const zIndex = ref(1000);
const navWidth = computed(() => {
  return sharedStore.isFull ? "0" : "200";
});
const topHeight = computed(() => {
  return sharedStore.isFull ? "0" : "90";
});

watch(
  () => props.modelValue,
  (newVal) => {
    dialogVisible.value = newVal;
    if (newVal) {
      zIndex.value = sharedStore.getIndex();
    }
  },
);

watch(dialogVisible, (newVal) => {
  emit("update:modelValue", newVal);
});

const toClose = () => {
  dialogVisible.value = false;
};

const handleClickBot = (btn) => {
  emit("botBtnClick", { btn });
};
</script>

<style scoped lang="scss">
/* 通用样式 */
/* 显示隐藏动画 */
.dia-enter-from,
.dia-leave-to {
  opacity: 0;
}
.dia-enter-active,
.dia-leave-active {
  transition: opacity 0.1s;
}

/* page类型样式 */
.diapageF {
  background-color: var(--c-bg-box);
  position: fixed;
  right: 0;
  padding-left: 10px;
}
.diapage {
  width: calc(100% - 10px);
  height: calc(100%);
  padding: 0 10px;
  background-color: var(--c-bg);

  & > .top {
    width: 100%;
    height: 42px;
  }
  & > .mid {
    width: 100%;
    height: calc(100% - 90px);
    overflow-y: auto;
  }
  & > .bot {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

/* drawer类型样式 */
.diadrawerF {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  right: 0;
}
.diadrawer {
  width: 700px;
  background-color: var(--c-bg-box);
  position: fixed;
  right: 0;
  & > .top {
    width: 100%;
    height: 50px;
    background-color: var(--c-bg-theme);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    .tLeft {
      width: 80%;
      height: 100%;
      display: flex;
      align-items: center;
      .title {
        display: inline-block;
        font-weight: bold;
        font-size: 18px;
        line-height: 40px;
        color: var(--c-text-theme);
      }
    }
    .tRight {
      img {
        cursor: pointer;
      }
    }
  }
  & > .top2 {
    width: 100%;
    height: 18px;
    background-color: var(--c-bg-theme);
  }
  & > .mid {
    width: 100%;
    height: calc(100% - 90px);
    margin-top: -18px;
    overflow-y: auto;

    .midbox {
      margin-left: 10px;
      width: calc(100% - 20px);
      background-color: var(--c-bg);
      border-radius: 6px;
      min-height: 100%;
      overflow: hidden;
    }
  }
  & > .bot {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
/* 抽屉动画 */
.diadrawer-enter-from,
.diadrawer-leave-to {
  transform: translateX(100%);
}
.diadrawer-enter-active,
.diadrawer-leave-active {
  transition: transform 0.2s ease;
}

/* box类型样式 */
.diaboxF {
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.diabox {
  background: var(--c-bg);
  & > .header {
    width: 100%;
    height: 5px;
    background: var(--c-bg-theme);
  }
  & > .top {
    width: 100%;
    padding: 0 10px;
    height: 35px;
    border-bottom: 1px solid var(--c-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      display: inline-block;
      font-weight: bold;
      font-size: 16px;
      line-height: 20px;
      color: var(--c-text);
    }
    img {
      cursor: pointer;
    }
  }
  & > .mid {
    width: 100%;
    min-height: 200px;
    padding-bottom: 20px;
  }
  & > .bot {
    width: 100%;
    height: 36px;
    background-color: var(--c-bg-box);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
  }
}
</style>
