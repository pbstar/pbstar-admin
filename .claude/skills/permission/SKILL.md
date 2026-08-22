---
name: permission
description: 项目统一权限模型（菜单/按钮合并为 MenuItem，key 为权限标识）的用法，新增菜单/按钮/页面权限
---

# 权限模型

菜单与按钮共用同一套权限模型：每个可权限项是一个 `MenuItem`，其 `key` 就是权限标识。后端返回逗号分隔的权限 key 字符串，`"all"` 表示全量放行。所有判断逻辑集中在 [`assets/utils/permission.ts`](../../../assets/utils/permission.ts) 的 `hasPermission` / `filterMenuTree`，别处不要各自实现判断。

## 菜单项结构

```ts
export interface MenuItem {
  key?: string;        // 权限标识；缺省表示纯展示分组节点（如"系统管理"），始终展示，可见性由 children 决定
  name: string;
  url?: string | null; // 页面路由（如 /list）
  icon?: string;
  children?: MenuItem[];
}
```

## 怎么加一个菜单/按钮

1. 在目标子应用的 [`src/constants/menus.ts`](../../../apps/example/src/constants/menus.ts) 里 `export default` 的菜单树中加一条 `MenuItem`，如 `{ key: "example_list", name: "用户列表", url: "/list", icon: "el-icon-tickets" }`。
2. 保证后端返回的权限 key 字符串里包含该 key（否则菜单/按钮会被过滤掉）。前端无需改主应用——主应用按 `appKey` 动态 `import()` 各子应用菜单并聚合（[`main/src/utils/appMenus.ts`](../../../main/src/utils/appMenus.ts)）。

按钮级权限用指令：

```vue
<el-button v-permission="'user_add'">新增</el-button>
```

`v-permission`（[`assets/directives/permission.ts`](../../../assets/directives/permission.ts)）按 key 精确匹配，无权限时 `display:none` 隐藏元素，值可以是字符串字面量或响应式变量。

## 判断函数

- `hasPermission(key, permissions)`：单个 key 是否命中；`key` 为空视为无需校验直接放行，`permissions === "all"` 全量放行。
- `filterMenuTree(items, permissions)`：递归过滤菜单树；叶子节点按自身 `key` 判断，分组节点（无 `key`）不做权限校验，只要过滤后仍有可见子节点就保留。

## 应用可见性

主应用侧（[`main/src/stores/apps.ts`](../../../main/src/stores/apps.ts)）对每个 `apps.json`/共享清单里的应用调用 `loadAppMenus` + `filterMenuTree`，**某应用以下存在至少一个当前用户可见菜单才算可见**。所以「权限过滤后的菜单」同时决定了应用切换栏里是否出现该应用。
