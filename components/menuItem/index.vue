<template>
  <t-menu-item v-bind="$attrs">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </t-menu-item>
</template>
<script setup>
import { MenuItem as TMenuItem } from "tdesign-vue-next";
</script>