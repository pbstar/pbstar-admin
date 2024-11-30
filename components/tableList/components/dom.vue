<template>
  <component
    v-if="'value' in item"
    :is="item.dom"
    v-model="item.value"
    v-bind="bind"
    v-on="on"
  >
    {{ content }}
  </component>
  <component v-else :is="item.dom" v-bind="bind" v-on="on">
    {{ content }}
  </component>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
});

const content = ref("");
if (props.item.content) {
  content.value = props.item.content;
} else if (props.item.contentFn && typeof props.item.contentFn === "function") {
  content.value = (() => {
    if (props.item.row) {
      return props.item.contentFn(props.item.row);
    } else {
      return props.item.contentFn();
    }
  })();
}

const on = {};
if (props.item.on && typeof props.item.on === "object") {
  for (let item in props.item.on) {
    on[item] = () => {
      if (props.item.row) {
        props.item.on[item](props.item.row);
      } else {
        props.item.on[item]();
      }
    };
  }
}

const bind = {};
if (props.item.bind && typeof props.item.bind === "object") {
  for (let item in props.item.bind) {
    if (typeof props.item.bind[item] === "function") {
      bind[item] = () => {
        if (props.item.row) {
          props.item.bind[item](props.item.row);
        } else {
          props.item.bind[item]();
        }
      };
    } else {
      bind[item] = props.item.bind[item];
    }
  }
}
if (props.item.bindFn && typeof props.item.bindFn === "object") {
  for (let item in props.item.bindFn) {
    if (typeof props.item.bindFn[item] === "function") {
      bind[item] = (() => {
        if (props.item.row) {
          return props.item.bindFn[item](props.item.row);
        } else {
          return props.item.bindFn[item]();
        }
      })();
    }
  }
}
</script>
<style scoped lang="scss"></style>
