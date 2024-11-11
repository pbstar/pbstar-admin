<template>
  <t-button v-bind="$attrs">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </t-button>
</template>
<script setup>
import { Button as TButton } from "tdesign-vue-next";
</script>
