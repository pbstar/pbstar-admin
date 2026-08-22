---
name: p-components
description: 使用项目公共组件库 @Pcomponents 构建页面/视图的用法说明（p-search/p-table/p-dialog/p-item/p-title/p-icon 等）
---

# PComponents 公共组件库

在子应用里用 `@Pcomponents` 别名引入共享组件库，所有组件从 [`components/index.ts`](../../../components/index.ts) 统一导出。不要按深层路径单独引组件，统一走 `@Pcomponents`。

## 组件清单

- **base**：`pCollapse` / `pDialog` / `pIcon` / `pItem` / `pSearch` / `pTable` / `pTitle`
- **more**：`pIconSelect` / `pVerificationCode`

完整参考：[`apps/example/src/views/list/index.vue`](../../../apps/example/src/views/list/index.vue)。

## 常见用法

### 查询表单 + 表格

```vue
<p-title :list="['用户列表']" />
<p-search style="margin-top: 10px" @search="toSearch" @reset="toReset">
  <p-item class="item" label="姓名">
    <el-input v-model="query.name" placeholder="请输入姓名" />
  </p-item>
</p-search>
<p-table
  style="margin-top: 10px"
  :data="data"
  :pagination="pagination"
  @paginationChange="toPageChange"
>
  <template #column>
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="operation" label="操作" fixed="right" width="200">
      <template #default="{ row }">
        <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
      </template>
    </el-table-column>
  </template>
  <template #topLeft>
    <el-button type="primary" @click="handleAdd">新增</el-button>
  </template>
</p-table>
```

- `p-search`：查询参数以插槽传入（`p-item` 里绑 `v-model`），交互事件 `@search` / `@reset`。
- `p-table`：列用 `#column` 插槽内的 `el-table-column` 定义（不含 config 表达式），`#topLeft` 放表格上方左侧操作；`pagination` 结构 `{ pageNumber, pageSize, total }`，翻页事件 `@paginationChange`。

### 弹窗/抽屉

```vue
<p-dialog title="详情" type="drawer" width="1000px" v-model="isDetail">
  <Detail ref="detailRef" :type="detailType" :id="detailId" />
  <template #footer>
    <el-button type="primary" @click="handleSave">保存</el-button>
    <el-button @click="isDetail = false">返回</el-button>
  </template>
</p-dialog>
```

- `p-dialog` 用 `v-model` 控制显隐，`type="drawer"` 切换为抽屉，底部按钮放 `#footer` 插槽。
- 详情/子表单建议单独拆到 `components/detail.vue`，通过 `ref` 暴露 `getFormValue()` 给父级取回填值（参考 example 的 list 页）。

### 图标

`<p-icon name="el-icon-arrow-down" />`，`name` 为 element-plus 图标名（含 `el-icon-` 前缀）或 iconfont 名。

## 新增组件

1. 在 `components/base/<组件名>/index.vue` 写组件（名称 `p-` 前缀，`defineOptions({ name: 'Pxxx' })`）。
2. 在 `components/index.ts` 追加一行导出。
3. 子应用内即可通过 `@Pcomponents` 使用，无需改主应用。

## 样式约定

页面根节点用 `class="page"`，背景用变量 `var(--c-bg)`；查询项 `.item` 固定 `width: 250px`。共享样式区在 `assets/css/`。
