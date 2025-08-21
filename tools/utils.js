import { execSync } from "child_process";
import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import apps from "../apps/apps.json" with { type: "json" };
import path from "path";
import { fileURLToPath } from "url";

// 获取当前模块路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 定义路径
export const TEMPLATE_DIR = path.join(__dirname, "./template");
export const TEMPLATE_ADD_OUT_DIR = path.join(__dirname, "./templateAddOut");
export const APPS_IN_DIR = path.join(__dirname, "../apps");
export const APPS_OUT_DIR = path.join(__dirname, "../../pbstar-admin-apps");

export function validateAppKey(input) {
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
}

export function getNextPort(appsJson) {
  const maxPort = Math.max(...appsJson.map((item) => item.devPort));
  const port = maxPort + 1;
  if (port < 8801 || port > 8899 || !port) {
    throw new Error("端口号超出范围（8801-8899）");
  }
  return port;
}

export function runAppCommand({ description, buildCommand }) {
  const list = ["main", ...apps.map((item) => item.key)];

  program
    .version("1.0.0")
    .description(description)
    .action(async () => {
      try {
        const answers = await inquirer.prompt([
          {
            type: "list",
            name: "appKey",
            message: `请选择要${description}的应用模块:`,
            choices: list,
          },
        ]);
        const { appKey } = answers;
        const command = buildCommand(appKey);
        execSync(command, { stdio: "inherit", cwd: "../" });
      } catch (err) {
        console.error(chalk.red("Error:"), err);
        process.exit(1);
      }
    });

  program.parse(process.argv);
}
