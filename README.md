# Pbstar-admin

Pbstar-admin 是一套全面便捷的后台管理系统解决方案，基于 wujie、pnpm 完成微前端架构，运用 vue3、vite、pinia、tdesign 等主流技术栈。
本项目提供[脚手架](./cli/README.md)、[组件库](./components/README.md)和[部署工具](./deploy/README.md)，帮助开发者快速搭建后台管理系统。

## 环境要求

- node.js >= 18.0.0
- pnpm >= 9.0.0

## 快速开始

```bash
# 克隆项目
git clone https://github.com/pbstar/pbstar-admin.git
# 进入项目目录
cd pbstar-admin
# 安装pnpm（如果已安装pnpm，请忽略此步骤）
npm install -g pnpm
# 安装依赖
pnpm install
# 启动main包
pnpm run dev:main
# 启动template包
pnpm run dev:template
```

## 创建包

```bash
pnpm run create
```

## 安装删除指定依赖

```bash
# 安装依赖到主包
pnpm add <依赖名>
# 安装依赖到指定包
pnpm add <依赖名> --filter <包名>
# 删除主包的依赖
pnpm remove <依赖名>
# 删除指定包的依赖
pnpm remove <依赖名> --filter <包名>
```

## 项目结构

```
├── cli              # 脚手架
├── components       # 组件
├── config           # 配置
├── deploy           # 部署
├── main             # main包
├── packages         # 模块包
│ ├── example        # 示例包
│ └── template       # 模板包
├── server           # 虚拟接口
├── utils            # 工具
├── package.json     # 依赖
└── README.md        # 说明
```
