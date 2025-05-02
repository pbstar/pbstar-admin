#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { replaceInFile } from "replace-in-file";

// 获取当前模块路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 定义路径
const TEMPLATE_DIR = path.join(__dirname, "./template");
const OUTPUT_DIR = path.join(__dirname, "../apps");

// 定义命令
program
  .version("1.0.0")
  .description("创建一个新的子应用")
  .action(async () => {
    try {
      // 交互式问答
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "appName",
          message: "子应用名称:",
          validate: (input) => {
            if (input.trim() === "") {
              return "请输入子应用名称";
            }
            if (!/^[a-z0-9-]+$/.test(input)) {
              return "子应用名称只能包含小写字母、数字和连字符";
            }
            if (input.startsWith("app-")) {
              return "子应用名称不能以 'app-' 开头";
            }
            return true;
          },
        },
      ]);

      const { appName } = answers;
      const appPath = path.join(OUTPUT_DIR, "app-" + appName);

      // 检查目录是否存在
      if (fs.existsSync(appPath)) {
        console.error(
          chalk.red(
            `错误: 目录 ${appPath} 已存在，请选择其他名称或删除现有的目录。`
          )
        );
        process.exit(1);
      }

      console.log(chalk.blue(`创建子应用: ${appName}`));

      // 创建项目目录
      fs.mkdirSync(appPath);

      // 复制模板文件
      await fs.copy(TEMPLATE_DIR, appPath);

      // 更新占位符
      const options = {
        files: [appPath + "/**/*"],
        from: [/{{name}}/g],
        to: [appName],
      };

      await replaceInFile(options);

      console.log(chalk.green("子应用创建成功!"));
      console.log(chalk.blue("\n下一步:"));
      console.log(
        "  1.请到/pbstar-admin/rsbuild.config.mjs文件中添加子应用配置"
      );
      console.log("  2.请到/pbstar-admin/package.json文件中添加子应用配置");
      console.log(
        "  3.请到/pbstar-admin/main/src/views/admin/apps.vue文件中添加子应用配置"
      );
      console.log("  4.启动子应用: pnpm run dev:" + appName);
    } catch (err) {
      console.error(chalk.red("Error creating project:"), err);
      process.exit(1);
    }
  });

program.parse(process.argv);
