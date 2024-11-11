<template>
  <t-menu v-bind="$attrs">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </t-menu>
</template>
<script setup>
import { Menu as TMenu } from "tdesign-vue-next";
</script>