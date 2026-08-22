---
name: develop
description: develop 模块（CLI 命令 create/dev/build/add/remove/check + 接口 mock）的用法说明
---

# develop 模块

根目录的 `pnpm run <cmd>` 会转给 [`develop/package.json`](../../../develop/package.json)（`pnpm run -filter develop <cmd>`）。所有 CLI 脚本在 `develop/cli/*.ts` 里用 `tsx` 直接跑，支持交互式选择。

## CLI 命令

| 命令 | 入口 | 作用 |
| --- | --- | --- |
| `pnpm run dev` | [`serve.ts`](../../../develop/cli/serve.ts) dev | 交互式选择要启动的应用模块（按 `apps.json` 的 `devPort`），美化打印服务地址 |
| `pnpm run build` | [`serve.ts`](../../../develop/cli/serve.ts) build | 交互式选择要构建的应用模块 |
| `pnpm run create` | [`create.ts`](../../../develop/cli/create.ts) | 交互式创建新子应用（脚手架，会同步写入 `apps/apps.json`，模板在 `develop/cli/template`） |
| `pnpm run add` / `remove` | [`dep.ts`](../../../develop/cli/dep.ts) | 交互式为指定工程增删依赖 |
| `pnpm run check` | [`check.ts`](../../../develop/cli/check.ts) | 跑 vue-tsc 类型检查，动态遍历子应用（不手写列举） |

改代码后没有单元测试与 ESLint，靠 `pnpm run check` + `pnpm run dev` 实跑验证。

## 接口 mock

开发期可不开后端，直接用 mock：

- **开关**：`.env` 里设 `PUBLIC_MOCK=T`（仅 `import.meta.env.DEV` 且为 `T` 时生效，`isMockEnabled` 见 [`develop/mock/persist.ts`](../../../develop/mock/persist.ts)）。生产环境永久关闭。
- **路由表**：在 [`develop/mock/index.ts`](../../../develop/mock/index.ts) 的 `routes` 里按 `"method:url"` 登记 handler，如 `"post:/system/user/getList": userMock.getList`，`method` 大小写不敏感。未登记的接口会告警并走真实请求。
- **数据**：`develop/mock/data/` 下每个模块导出内存数组，`request.ts` 通过 `matchMock`（开发/打包入口）拦截，带 ~200ms 延迟。接口返回统一 `Res<T>`（`{ code, msg, data }`）。
- **持久化**：mock 数据在变更后写入 localStorage 键 `p_mock_data`（`persist()`），下次刷新沿用改动；去掉该键再刷新即可重置为种子数据。

新增后端接口对接页面时，如果希望无后端也能跑，就在 `routes` 加一条对应 entry 并在 `data/` 补数据，让 mock 命中。

## 依赖与实际改动

根目录脚本只做转发，真正的逻辑在 `develop/cli`（用 `commander` + `@inquirer/prompts` + `fs-extra`）。涉及「新增子应用 / 依赖管理 / 构建配置」时去 `develop/cli` 与 `rsbuild.config.ts` 找对应实现，不要直接改 `apps/apps.json`（由 CLI 维护）。
