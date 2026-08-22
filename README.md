<div align="center">
    <img src="https://github.com/pbstar/pbstar-admin/blob/main/main/src/assets/imgs/logo-w.png" height="80px" alt="PbstarAdmin Logo">
    <h1 style="margin-bottom:30px;margin-top:10px; font-weight: bold;">PbstarAdmin 微后台🎉</h1>
    <h4>
        <div style="margin-bottom:5px;">基于 <strong>wujie微前端 + rsbuild高性能构建 + pnpm monorepo</strong> 的现代化架构</div>
        <div style="margin-bottom:0;">集成 <strong>Vue3 + Pinia + Element Plus</strong> 主流技术体系，提供从开发到部署的完整解决方案</div>
    </h4>
</div>

<p align="center">
    <a href="http://pbstar-admin-docs.pbstar.cn/">
        <img src="https://img.shields.io/badge/📖_官方文档-5672CD?style=for-the-badge" alt="官方文档">
    </a>
    <a href="http://pbstar-admin.pbstar.cn/">
        <img src="https://img.shields.io/badge/🚀_在线演示-FF5722?style=for-the-badge" alt="在线演示">
    </a>
    <a href="https://github.com/pbstar/pbstar-admin">
        <img src="https://img.shields.io/badge/💬_微信-P24612582-07C160?style=for-the-badge" alt="WeChat">
    </a>
</p>

## ✨ 项目特点

- **🚀 微前端架构**: 基于腾讯wujie微前端框架，支持内外部子应用动态加载，实现真正的应用级微前端解耦
- **📦 智能模块化**: pnpm monorepo工作区管理，支持内外部子应用（in/out类型），外部子应用可独立git仓库管理
- **🧩 企业级组件化**: 共享组件库设计，@Pcomponents、@Passets统一别名引用，支持跨应用组件复用
- **⚙️ 全链路工程化**: 完整的CLI工具链（create/dev/build/add/remove），自动化脚手架、依赖管理、打包部署
- **⚡ 极致现代化**: 基于Rsbuild高性能构建系统，多环境配置，支持子应用独立开发、调试、打包

## 📋 环境要求

- node >= 20.19.0（推荐使用 Node.js 22 LTS）
- pnpm >= 9.15.0

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/pbstar/pbstar-admin.git
# 进入项目目录
cd pbstar-admin
# 克隆外部子应用仓库（可选）
git submodule update --init
# 安装pnpm（如果已安装pnpm，请忽略此步骤）
npm install -g pnpm
# 安装依赖
pnpm install
# 启动项目
pnpm run dev
# 打包项目
pnpm run build
# 添加指定依赖包
pnpm run add
# 移除指定依赖包
pnpm run remove
# 创建子应用
pnpm run create
```

## 📁 项目结构

```
├── apps                        # 子应用
│ ├── example                   # 示例应用
│ ├── system                    # 系统应用
│ ├── out-app                   # 外部子应用（git submodule，独立仓库）
│ ├── appInit.ts                # 子应用公共初始化逻辑
│ ├── useMicroApp.ts            # 微应用挂载公共逻辑
│ └── apps.json                 # 子应用配置（唯一清单来源）
├── assets                      # 静态资源
├── components                  # 组件库
├── main                        # 主应用
├── develop                     # 开发模块
├── .gitignore                  # git忽略文件
├── .gitmodules                 # git子模块配置
├── package.json                # 依赖
├── tsconfig.base.json          # TypeScript 公共配置
├── pnpm-workspace.yaml         # 工作区配置
├── rsbuild.config.ts           # 打包配置
└── README.md                   # 说明
```

## 💝 致谢

本项目能够顺利完成，离不开以下优秀开源项目和工具，在此表示衷心感谢：

### 🏗️ 核心架构

- [**git-submodule**](https://git-scm.com/docs/git-submodule) - 用于实现外部子应用的独立版本控制
- [**wujie**](https://github.com/Tencent/wujie) - 腾讯开源的微前端框架，提供强大的微前端解决方案
- [**rsbuild**](https://github.com/web-infra-dev/rsbuild) - 基于 Rspack 的高性能构建工具，提供极速的构建体验
- [**pnpm**](https://github.com/pnpm/pnpm) - 快速、节省磁盘空间的包管理器，优化依赖管理
- [**vue**](https://github.com/vuejs/core) - 渐进式 JavaScript 框架，构建用户界面的基础

### 📚 灵感采集

- [vue-vben-admin](https://github.com/vbenjs/vue-vben-admin)、[Geeker-Admin](https://github.com/HalseySpicy/Geeker-Admin)、[gi-demo](https://github.com/lin-97/gi-demo)、[teek-design-vue3](https://github.com/Kele-Bingtang/teek-design-vue3)
