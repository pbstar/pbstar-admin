#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { replaceInFile } from "replace-in-file";
import {
  TEMPLATE_DIR,
  TEMPLATE_ADD_OUT_DIR,
  APPS_IN_DIR,
  APPS_OUT_DIR,
  validateAppKey,
  getNextPort,
} from "./utils.js";

program
  .version("1.0.0")
  .description("创建一个新的子应用")
  .action(async () => {
    try {
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
          validate: validateAppKey,
        },
      ]);

      const { appType, appKey } = answers;
      const appPath = path.join(
        appType === "out" ? APPS_OUT_DIR : APPS_IN_DIR,
        appKey,
      );

      if (fs.existsSync(appPath)) {
        throw new Error(`目录 ${appPath} 已存在`);
      }

      const appsJsonPath = path.join(APPS_IN_DIR, "apps.json");
      if (fs.existsSync(appsJsonPath)) {
        const appsJson = fs.readJsonSync(appsJsonPath);
        if (appsJson.some((item) => item.key === appKey)) {
          throw new Error(`子应用 ${appKey} 已存在`);
        }

        const port = getNextPort(appsJson);
        appsJson.push({
          key: appKey,
          type: appType,
          devPort: port,
          proUrl: "",
        });
        fs.writeJsonSync(appsJsonPath, appsJson, { spaces: 2 });
      }

      console.log(chalk.blue(`创建子应用: ${appKey}`));
      fs.mkdirSync(appPath, { recursive: true });
      await fs.copy(TEMPLATE_DIR, appPath);

      if (appType === "out") {
        await fs.copy(TEMPLATE_ADD_OUT_DIR, appPath);
      }

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
