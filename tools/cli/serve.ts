import { execSync, spawn } from "child_process";
import { program } from "commander";
import inquirer from "inquirer";
import type { DistinctQuestion } from "inquirer";
import chalk from "chalk";
import apps from "../../apps/apps.json" with { type: "json" };

// 可操作的应用模块列表
const list = ["main", ...apps.map((item) => item.key)];

/**
 * 根据应用模块生成启动/构建命令
 * @param appKey 应用模块 key
 * @param mode 操作类型
 * @param isSingle 是否单选（仅 dev 模式主应用据此决定是否自动打开浏览器）
 */
const buildCommand = (appKey: string, mode: "dev" | "build", isSingle: boolean): string => {
  if (appKey === "main") {
    return mode === "dev"
      ? `rsbuild dev --environment main --port 8800${isSingle ? " --open" : ""}`
      : "rsbuild build --environment main";
  }
  const app = apps.find((item) => item.key === appKey)!;
  return mode === "dev"
    ? `rsbuild dev --environment ${appKey} --port ${app.devPort}`
    : `rsbuild build --environment ${appKey}`;
};

/**
 * 并行启动多个 dev 服务（长驻进程）
 * @param commands 命令列表
 */
const startDevServers = (commands: string[]): void => {
  const children = commands.map((command) => {
    const [cmd, ...args] = command.split(" ");
    return spawn(cmd, args, { stdio: "inherit", cwd: "../" });
  });

  // Ctrl+C / kill 时一并结束所有 dev 服务，避免残留进程
  const killAll = (signal: NodeJS.Signals) => {
    children.forEach((child) => child.kill(signal));
    process.exit(0);
  };
  process.once("SIGINT", () => killAll("SIGINT"));
  process.once("SIGTERM", () => killAll("SIGTERM"));
};

/**
 * 处理应用模块的启动/构建
 * @param mode 操作类型
 */
const handleServe = async (mode: "dev" | "build") => {
  const isDev = mode === "dev";
  try {
    const question: DistinctQuestion<{ appKeys: string[] }> = {
      type: "checkbox",
      name: "appKeys",
      message: isDev
        ? "请选择要启动的应用模块(空格多选):"
        : "请选择要构建的应用模块(空格多选):",
      choices: list,
      validate: (selected) =>
        selected.length > 0 ? true : "请至少选择一个应用模块",
    };
    const { appKeys } = await inquirer.prompt<{ appKeys: string[] }>([question]);

    const isSingle = appKeys.length === 1;
    const commands = appKeys.map((key) => buildCommand(key, mode, isSingle));

    if (isDev) {
      // dev 模式：长驻进程，并行启动多个
      startDevServers(commands);
    } else {
      // build 模式：串行构建，输出清晰、资源占用平稳
      commands.forEach((command) =>
        execSync(command, { stdio: "inherit", cwd: "../" }),
      );
    }
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
