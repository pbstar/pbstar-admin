<template>
  <el-button v-bind="$attrs" v-on="$listeners" v-if="isAuth">
    <slot></slot>
  </el-button>
</template>
<script setup>
import { ref } from "vue";
import useSharedStore from "@Passets/stores/shared";

const sharedStore = useSharedStore();
const mybtns = ref(sharedStore.userInfo?.btns || []);
const props = defineProps({
  auth: {
    type: String,
    default: "",
  },
});
const isAuth = computed(() => !props.auth || mybtns.value.includes(props.auth));
</script>
