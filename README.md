# Pbstar-admin

## 简介

Pbstar-admin 是一套后台管理系统解决方案。提供[脚手架](./cli/README.md)、[组件库](./components/README.md)和[部署工具](./deploy/README.md)，帮助开发者快速搭建后台管理系统。

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
# 启动主包
pnpm run dev:main
# 启动template包
pnpm run dev:template
```

## 创建业务包

```bash
pnpm run create
```

## 安装删除指定依赖

```bash
# 安装指定依赖到主包
pnpm add <依赖名>
# 安装指定依赖到业务包
pnpm add <依赖名> --filter <业务包名>
# 删除主包的指定依赖
pnpm remove <依赖名>
# 删除业务包的指定依赖
pnpm remove <依赖名> --filter <业务包名>
```

## 项目结构

```
├── cli              # 脚手架
├── components       # 组件
├── config           # 配置
├── deploy           # 部署
├── main             # 主包
├── packages         # 业务包
├── utils            # 工具
├── .gitignore       # git忽略
├── package.json     # 依赖
└── README.md        # 说明
```
