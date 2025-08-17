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
const TEMPLATE_ADD_OUT_DIR = path.join(__dirname, "./templateAddOut");
const APPS_IN_DIR = path.join(__dirname, "../apps");
const APPS_OUT_DIR = path.join(__dirname, "../../pbstar-admin-apps");

// 定义命令
program
  .version("1.0.0")
  .description("创建一个新的子应用")
  .action(async () => {
    try {
      // 交互式问答
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "appType",
          message: "子应用类型:",
          choices: ["in", "out"],
        },
        {
          type: "input",
          name: "appKey",
          message: "子应用Key:",
          validate: (input) => {
            const blackList = ["main", "components"];
            if (input.trim() === "") {
              return "请输入子应用Key";
            }
            if (blackList.includes(input)) {
              return "子应用Key不能为" + input;
            }
            if (!/^[a-z0-9-]+$/.test(input)) {
              return "子应用Key只能包含小写字母、数字和连字符";
            }
            return true;
          },
        },
      ]);

      const { appType, appKey } = answers;
      const appPath = path.join(
        appType === "out" ? APPS_OUT_DIR : APPS_IN_DIR,
        appKey,
      );

      // 检查目录是否存在
      if (fs.existsSync(appPath)) {
        console.error(
          chalk.red(
            `错误: 目录 ${appPath} 已存在，请选择其他名称或删除现有的目录。`,
          ),
        );
        process.exit(1);
      }

      // apps.json文件中添加子应用配置
      const appsJsonPath = path.join(APPS_IN_DIR, "apps.json");
      let port = 0;
      if (fs.existsSync(appsJsonPath)) {
        const appsJson = fs.readJsonSync(appsJsonPath);
        const appIndex = appsJson.findIndex((item) => item.key === appKey);
        if (appIndex !== -1) {
          console.error(
            chalk.red(
              `错误: 子应用 ${appKey} 已存在，请选择其他名称或删除现有的子应用。`,
            ),
          );
          process.exit(1);
        }
        const maxPort = Math.max(...appsJson.map((item) => item.devPort));
        port = maxPort + 1;
        if (port < 8801 || port > 8899 || !port) {
          console.error(
            chalk.red(
              "错误: 端口号超出范围（ 8801-8899 ），请检测子应用配置（ /pbstar-admin/apps/apps.json ）。",
            ),
          );
          process.exit(1);
        }
        appsJson.push({
          key: appKey,
          type: appType,
          devPort: port,
          proUrl: "",
        });
        fs.writeJsonSync(appsJsonPath, appsJson, { spaces: 2 });
      }

      console.log(chalk.blue(`创建子应用: ${appKey}`));

      // 创建项目目录
      fs.mkdirSync(appPath, { recursive: true });

      // 复制模板文件
      await fs.copy(TEMPLATE_DIR, appPath);

      // 补充模板文件
      if (appType === "out") {
        await fs.copy(TEMPLATE_ADD_OUT_DIR, appPath);
      }

      // 更新占位符
      await replaceInFile({
        files: [appPath + "/**/*"],
        from: [/P{key}/g],
        to: [appKey],
      });

      console.log(chalk.green("子应用创建成功!"));
      console.log(chalk.blue("\n下一步:"));
      console.log("  启动子应用: " + chalk.blue("pnpm run dev"));
    } catch (err) {
      console.error(chalk.red("Error creating project:"), err);
      process.exit(1);
    }
  });

program.parse(process.argv);
