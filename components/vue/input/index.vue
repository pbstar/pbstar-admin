<template>
  <t-input v-bind="$attrs">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </t-input>
</template>
<script setup>
import { Input as TInput } from "tdesign-vue-next";
</script>
