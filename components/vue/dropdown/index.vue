<template>
  <t-dropdown v-bind="$attrs">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </t-dropdown>
</template>
<script setup>
import { Dropdown as TDropdown } from "tdesign-vue-next";
</script>