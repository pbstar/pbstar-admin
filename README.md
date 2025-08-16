<div align="center">
    <img src="https://github.com/pbstar/pbstar-admin/blob/main/main/src/assets/imgs/logo-w.png" height="80px">
    <h1 style="margin-bottom:30px;margin-top:10px; font-weight: bold;">PbstarAdmin 微后台🎉</h1>
    <h4>
        <div style="margin-bottom:5px;">基于 wujie、rsbuild、pnpm 完成微前端架构，运用 vue3、pinia、element plus 等主流技术栈。</div>
        <div style="margin-bottom:0;">提供脚手架、组件库、代码生成器和部署工具(计划)等全套工具链。</div>
    </h4>
</div>

<p align="center">
	<a href="https://github.com/pbstar/pbstar-admin/blob/main/LICENSE"><img src="https://img.shields.io/github/license/mashape/apistatus.svg"></a>
    <a href="http://pbstar-admin-docs.pbstar.cn/"><img src="https://img.shields.io/badge/官方文档-5672CD?style=flat"></a>
    <a href="http://pbstar-admin.pbstar.cn/"><img src="https://img.shields.io/badge/在线演示-FF5722?style=flat"></a>
    <a href="https://github.com/pbstar/pbstar-admin"><img src="https://img.shields.io/badge/WeChat-P24612582-brightgreen.svg"></a>
</p>

## 环境要求

- node >= 18.12.0
- pnpm >= 9.15.0

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
# 启动项目
pnpm run dev
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
│ ├── inner                # 内部应用
│ ├── outer                # 外部应用
│ └── apps.json            # 子应用配置
├── assets                 # 静态资源
├── build                  # 打包产物
├── components             # 组件
├── main                   # 主应用
├── tools                  # 工具
├── package.json           # 依赖
├── pnpm-workspace.yaml    # 工作区配置
├── rsbuild.config.mjs     # 打包配置
└── README.md              # 说明
```

## 致谢

本项目参考了以下优秀的开源项目，在此表示感谢：

[vue-vben-admin](https://github.com/vbenjs/vue-vben-admin)、[Geeker-Admin](https://github.com/HalseySpicy/Geeker-Admin)、[gi-demo](https://github.com/lin-97/gi-demo)
