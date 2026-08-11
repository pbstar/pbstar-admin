<script setup lang="ts">
import { pIcon } from "@Pcomponents";
import { useUserHeader } from "./useUserHeader";

const { theme, themeChange } = useUserHeader();
</script>

<template>
  <el-switch
    v-model="theme"
    inline-prompt
    active-text="深色"
    inactive-text="浅色"
    style="
      border-color: #fff;
      --el-switch-on-color: #2c384d;
      --el-switch-off-color: #2165c9;
    "
    @change="themeChange"
  >
    <template #active-action>
      <p-icon name="el-icon-moon" />
    </template>
    <template #inactive-action>
      <p-icon name="el-icon-sunny" />
    </template>
  </el-switch>
</template>
