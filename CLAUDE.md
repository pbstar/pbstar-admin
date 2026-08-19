# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

PbstarAdmin：基于 **wujie 微前端 + rsbuild + pnpm monorepo** 的后台管理系统。主应用（`main`）作为容器，动态加载内部子应用（`apps/*`）和外部子应用（git submodule）。

## 常用命令

```bash
git submodule update --init   # 首次拉仓库后，初始化外部子应用
pnpm install                  # 安装依赖
pnpm run dev                  # 交互式选择要启动的应用模块
pnpm run build                # 交互式选择要构建的应用模块
pnpm run create                # 交互式创建新子应用
pnpm run add / remove          # 交互式为指定工程增删依赖
pnpm run type-check             # 跑 vue-tsc 类型检查
```

没有 ESLint/Prettier 配置，也没有测试框架——改动后主要靠 `type-check` 和 `dev` 实跑验证。

## 关键架构点

- **子应用清单**：`apps/apps.json` 是唯一来源（`key`/`appType`/`devPort`/`proUrl`），驱动 rsbuild 的多 environment 配置和主应用路由。新增子应用用 `pnpm run create`，不要手改。
- **微前端挂载**：[main/src/views/admin/app.vue](main/src/views/admin/app.vue) 用 wujie 的 `startApp`/`destroyApp` 按路由启停子应用；主子应用间用共享 Pinia（`assets/stores/shared.ts`）+ wujie `bus` 事件同步状态。
- **权限模型**（菜单+按钮已合并为统一模型）：各子应用在自己的 `src/constants/menus.ts` 维护硬编码菜单树，后端返回逗号分隔的权限 key 字符串；[assets/utils/permission.ts](assets/utils/permission.ts) 的 `hasPermission`/`filterMenuTree` 是唯一判断逻辑，按钮权限用 `v-permission="'key'"` 指令。新增菜单/按钮只需加一条菜单项 + 保证后端权限里有对应 key。
- **路径别名**：`@` 指向当前应用自己的 `src`；`@Pcomponents` 指向根目录 `components/`（共享组件库）；`@Passets` 指向根目录 `assets/`（共享 stores/utils/directives）。
- **环境变量**：`.env.development`/`.env.production`（gitignore，本地维护，`.env.example` 是提交的模板），变量统一 `PUBLIC_` 前缀。
