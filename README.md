# Pbstar-admin

Pbstar-admin 是一套全面便捷的后台管理系统解决方案，基于 wujie、rsbuild、pnpm 完成微前端架构，运用 vue3、pinia、element plus 等主流技术栈。
本项目提供脚手架(计划)、[组件库](./components/README.md)、代码生成器(计划)和部署工具(计划)，帮助开发者快速搭建后台管理系统。

## 环境要求

- node >= 18.0.0
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
pnpm run dev
# 启动example包
pnpm run dev:example
```

## 创建子应用

```bash
pnpm run create
```

## 安装删除指定依赖

```bash
# 安装依赖到主包
pnpm add <依赖名> -w
# 安装依赖到指定包
pnpm add <依赖名> --filter <包名>
# 删除主包的依赖
pnpm remove <依赖名>
# 删除指定包的依赖
pnpm remove <依赖名> --filter <包名>
```

## 项目结构

```
├── apps             # 子应用
│ ├── app-system     # 系统管理
│ └── app-example    # 示例应用
├── assets           # 静态资源
├── build            # 打包
├── cli              # 脚手架
├── components       # 组件
├── config           # 配置
├── deploy           # 部署
├── main             # main包
├── server           # 虚拟接口
├── package.json     # 依赖
└── README.md        # 说明
```
