<template>
  <div class="r_top">
    <div class="r_t_left">
      <t-button variant="text" shape="square" @click="changeCollapsed">
        <template #icon>
          <t-icon :name="props.collapsed ? 'menu-fold' : 'menu-unfold'" />
        </template>
      </t-button>
      <span class="pageName">{{ props.pageName }}</span>
    </div>
    <div class="r_t_right">
      <t-dropdown
        :options="options"
        placement="bottom"
        trigger="click"
        @click="clickHandler"
      >
        <t-button variant="text">
          <template #icon> <t-icon name="user" size="16" /></template>
          <span>{{ name }}</span>
          <template #suffix> <t-icon name="chevron-down" size="16" /></template>
        </t-button>
      </t-dropdown>
    </div>
  </div>
</template>
<script setup>
import useUserStore from "@/stores/user";
import { ref } from "vue";
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
  pageName: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["collapsedChange"]);
const user = useUserStore();
const userInfo = user.getInfo();
const name = ref(userInfo.user_info.name);
const options = ref([{ content: "退出登录", value: 2 }]);
const changeCollapsed = () => {
  emits("collapsedChange", !props.collapsed);
};
const clickHandler = (e) => {
  if (e.value === 2) {
    user.clearInfo();
    router.push({ path: "/login" });
  }
};
</script>
<style scoped lang="scss">
.r_top {
  height: 56px;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;

  .r_t_left {
    display: flex;
    align-items: center;

    .pageName {
      margin-left: 10px;
      font-size: 14px;
    }
  }
}
</style>
