<template>
  <div class="table">
    <pTableList :searchList="searchList"/>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const searchList = ref([
  {
    label: '用户名',
    type: 'input',
    key: 'username',
    placeholder: '请输入用户名'
  },
  {
    label: '手机号',
    type: 'input',
    key: 'phone',
    placeholder: '请输入手机号'
  },
  {
    label: '邮箱',
    type: 'input',
    key: 'email',
    placeholder: '请输入邮箱'
  },
  {
    label: '状态',
    type: 'select',
    key: 'status',
    placeholder: '请选择状态',
    options:[]
  }
])
</script>
<style scoped></style>
