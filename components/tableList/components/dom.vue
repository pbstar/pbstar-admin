<template>
  <component
    v-if="'value' in item"
    :is="item.dom"
    v-model="item.value"
    v-bind="item.bind || {}"
    v-on="on || {}"
  >
    {{ item.content }}
  </component>
  <component v-else :is="item.dom" v-bind="item.bind || {}" v-on="on || {}">
    {{ item.content }}
  </component>
</template>
<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
});
const on = {};
for (let item in props.item.on) {
  on[item] = () => {
    if (props.item.row) {
      props.item.on[item](props.item.row);
    } else {
      props.item.on[item]();
    }
  };
}
</script>
<style scoped lang="scss"></style>
