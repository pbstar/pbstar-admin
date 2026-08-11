import { execSync } from "child_process";
import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import apps from "../../apps/apps.json" with { type: "json" };

// 可操作的应用模块列表
const list = ["main", ...apps.map((item) => item.key)];

/**
 * 处理应用模块的启动/构建
 * @param mode 操作类型
 */
const handleServe = async (mode: "dev" | "build") => {
  const isDev = mode === "dev";
  try {
    const answers = await inquirer.prompt<{ appKey: string }>([
      {
        type: "list",
        name: "appKey",
        message: isDev ? "请选择要启动的应用模块:" : "请选择要构建的应用模块:",
        choices: list,
      },
    ]);
    const { appKey } = answers;
    // 构建命令
    let command: string;
    if (appKey === "main") {
      command = isDev
        ? "rsbuild dev --environment main --port 8800 --open"
        : "rsbuild build --environment main";
    } else {
      const app = apps.find((item) => item.key === appKey);
      if (!app) return;
      command = isDev
        ? `rsbuild dev --environment ${appKey} --port ${app.devPort}`
        : `rsbuild build --environment ${appKey}`;
    }
    execSync(command, { stdio: "inherit", cwd: "../" });
  } catch (err) {
    console.error(chalk.red("Error:"), err);
    process.exit(1);
  }
};

program
  .version("1.0.0")
  .description("运行应用模块")
  .command("dev")
  .description("启动应用模块")
  .action(() => handleServe("dev"));

program
  .command("build")
  .description("构建应用模块")
  .action(() => handleServe("build"));

program.parse(process.argv);
