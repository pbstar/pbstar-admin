<div align="center">
    <img src="https://github.com/pbstar/pbstar-admin/blob/main/main/src/assets/imgs/logo-w.png" height="80px">
    <h1 style="margin-bottom:30px;margin-top:10px; font-weight: bold;">PbstarAdmin 微后台🎉</h1>
    <h4>
        <div style="margin-bottom:5px;">基于 wujie、rsbuild、pnpm 完成微前端架构，运用 vue3、pinia、element plus 等主流技术栈。</div>
        <div style="margin-bottom:0;">提供脚手架、组件库、代码生成器和部署工具(计划)等全套工具链。</div>
    </h4>
</div>

<p align="center">
	<a href="https://github.com/pbstar/pbstar-admin"><img src="https://img.shields.io/badge/PbstarAdmin-v0.0.0-brightgreen.svg"></a>
	<a href="https://github.com/pbstar/pbstar-admin/blob/main/LICENSE"><img src="https://img.shields.io/github/license/mashape/apistatus.svg"></a>
    <a href="http://152.136.96.92:8799"><img src="https://img.shields.io/badge/官方文档-5672CD?style=flat"></a>
    <a href="https://github.com/pbstar/pbstar-admin"><img src="https://img.shields.io/badge/在线演示-FF5722?style=flat"></a>
</p>

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
# 启动后端server服务
pnpm run server
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
├── apps                   # 子应用
│ ├── system               # 系统管理
│ └── example              # 示例应用
├── assets                 # 静态资源
├── cli                    # 脚手架
├── components             # 组件
├── main                   # 主应用
├── server                 # 服务端
├── package.json           # 依赖
├── pnpm-workspace.yaml    # 工作区配置
├── rsbuild.config.mjs     # 打包配置
└── README.md              # 说明
```
