import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { execSync, spawn, spawnSync } from "child_process";
import { checkbox } from "@inquirer/prompts";
import { program } from "commander";
import chalk from "chalk";
import apps from "../../apps/apps.json" with { type: "json" };

// 可操作的应用模块列表
const list = ["main", ...apps.map((item) => item.key)];

/**
 * 检测外部子应用（git submodule）是否已初始化
 * 未执行 `git submodule update --init` 时目录为空，直接启动会报出不直观的构建错误
 * @param appKey 应用模块 key
 */
const isUninitializedSubmodule = (appKey: string): boolean => {
  const app = apps.find((item) => item.key === appKey);
  if (!app || app.appType !== "out") return false;
  const appPath = join("../apps", appKey);
  return !existsSync(appPath) || readdirSync(appPath).length === 0;
};

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
  // Windows 下 node_modules/.bin 内的命令是 .cmd/.ps1 shim，spawn 不开 shell 会直接 ENOENT
  const isWin = process.platform === "win32";
  const children = commands.map((command) => {
    const [cmd, ...args] = command.split(" ");
    return spawn(cmd, args, { stdio: "inherit", cwd: "../", shell: isWin });
  });

  // Ctrl+C / kill 时一并结束所有 dev 服务，避免残留进程
  const killAll = (signal: NodeJS.Signals) => {
    children.forEach((child) => {
      if (isWin && child.pid) {
        spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"]);
      } else {
        child.kill(signal);
      }
    });
    process.exit(0);
  };
  process.once("SIGINT", () => killAll("SIGINT"));
  process.once("SIGTERM", () => killAll("SIGTERM"));
};

/**
 * 手动打印已启动 dev 服务的访问地址（替代 rsbuild 默认打印，输出更简洁美观）
 */
const printDevUrls = (): void => {
  console.log();
  console.log(chalk.cyan.bold("  🚀 PbstarAdmin 开发服务已启动"));
  console.log(chalk.gray("  ──────────────────────────────"));
  // main 是唯一访问入口，子应用经 wujie 挂载，固定打印 main 即可
  console.log(
    `  ${chalk.green("➜")}  ${chalk.bold("main")}  ${chalk.cyan.underline("http://localhost:8800")}`,
  );
  console.log();
};

/**
 * 处理应用模块的启动/构建
 * @param mode 操作类型
 */
const handleServe = async (mode: "dev" | "build") => {
  const isDev = mode === "dev";
  try {
    const appKeys = await checkbox({
      message: isDev
        ? "请选择要启动的应用模块(空格多选):"
        : "请选择要构建的应用模块(空格多选):",
      // main 是唯一访问入口，子应用经 wujie 挂载，不支持单独运行，故锁定为必选
      choices: list.map((key) => ({
        value: key,
        name: key,
        checked: key === "main",
        disabled: key === "main",
      })),
    });

    // 外部子应用未初始化（git submodule 未拉取）时给出友好提示并跳过，而非让 rsbuild 报错
    const uninitialized = appKeys.filter(isUninitializedSubmodule);
    if (uninitialized.length > 0) {
      uninitialized.forEach((key) => {
        console.log(
          chalk.yellow(
            `⚠️  外部子应用 "${key}" 尚未初始化，请先执行 git submodule update --init 拉取代码，已跳过该应用。`,
          ),
        );
      });
    }
    const validAppKeys = appKeys.filter((key) => !uninitialized.includes(key));
    if (validAppKeys.length === 0) {
      console.error(chalk.red("Error: 没有可用的应用模块，操作已取消。"));
      process.exit(1);
    }

    const isSingle = validAppKeys.length === 1;
    const commands = validAppKeys.map((key) => buildCommand(key, mode, isSingle));

    if (isDev) {
      // dev 模式：长驻进程，并行启动多个
      startDevServers(commands);
      printDevUrls();
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
