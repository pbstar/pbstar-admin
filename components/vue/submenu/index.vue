<template>
  <t-submenu v-bind="$attrs">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </t-submenu>
</template>
<script setup>
import { Submenu as TSubmenu } from "tdesign-vue-next";
</script>