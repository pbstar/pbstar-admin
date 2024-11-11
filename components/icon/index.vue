<template>
  <t-icon v-bind="$attrs">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </t-icon>
</template>
<script setup>
import { Icon as TIcon } from "tdesign-vue-next";
</script>
