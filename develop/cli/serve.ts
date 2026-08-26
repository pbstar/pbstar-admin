import { existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync, spawn, spawnSync } from "child_process";
import { checkbox } from "@inquirer/prompts";
import { program } from "commander";
import chalk from "chalk";
import apps from "../../apps/apps.json" with { type: "json" };
import { banner, divider, ok, warn, fail, urlRow, padRight } from "./ui";

// 仓库根目录：由 import.meta.url 推导，避免依赖进程 cwd（参照 check.ts）
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../");

const allAppKeys = ["main", ...apps.map((item) => item.appKey)];

/**
 * 未执行 `git submodule update --init` 时目录为空，直接启动会报出不直观的构建错误
 */
const isUninitializedSubmodule = (appKey: string): boolean => {
  const app = apps.find((item) => item.appKey === appKey);
  if (!app || app.appType !== "out") return false;
  const appPath = join(ROOT, "apps", appKey);
  return !existsSync(appPath) || readdirSync(appPath).length === 0;
};

/**
 * @param isSingle 是否单选（仅 dev 模式主应用据此决定是否自动打开浏览器）
 */
const buildCommand = (appKey: string, mode: "dev" | "build", isSingle: boolean): string => {
  if (appKey === "main") {
    return mode === "dev"
      ? `rsbuild dev --environment main --port 8800${isSingle ? " --open" : ""}`
      : "rsbuild build --environment main";
  }
  const app = apps.find((item) => item.appKey === appKey)!;
  return mode === "dev"
    ? `rsbuild dev --environment ${appKey} --port ${app.devPort}`
    : `rsbuild build --environment ${appKey}`;
};

const startDevServers = (commands: string[]): void => {
  // Windows 下 node_modules/.bin 内的命令是 .cmd/.ps1 shim，spawn 不开 shell 会直接 ENOENT
  const isWin = process.platform === "win32";
  const children = commands.map((command) => {
    const [cmd, ...args] = command.split(" ");
    return spawn(cmd, args, { stdio: "inherit", cwd: ROOT, shell: isWin });
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
 * main 是唯一访问入口：子应用经 wujie 运行时挂载，弱化展示便于排查即可
 */
const printDevUrls = (appKeys: string[]): void => {
  banner("🚀 PbstarAdmin 开发服务已启动");
  divider();

  const subApps = apps.filter((app) => appKeys.includes(app.appKey));
  urlRow("主应用", "main", "http://localhost:8800");
  subApps.forEach((app) => {
    console.log(
      `  ${chalk.gray("▸")}  ${chalk.gray.bold(padRight(app.appKey, 22))} ${chalk.gray("http://localhost:" + app.devPort)}`,
    );
  });

  console.log();
  console.log(
    chalk.gray("  ✨ 子应用经 wujie 运行时加载，请通过主应用地址访问。按 Ctrl+C 停止全部服务。"),
  );
};

const handleServe = async (mode: "dev" | "build") => {
  const isDev = mode === "dev";
  const verb = isDev ? "启动" : "构建";
  banner(isDev ? "🚀 PbstarAdmin 开发服务" : "📦 PbstarAdmin 构建");
  try {
    const appKeys = await checkbox({
      message: `请选择要${verb}的应用模块`,
      // main 是唯一访问入口，子应用经 wujie 挂载，不支持单独运行，故锁定为必选
      choices: allAppKeys.map((value) => {
        const app = apps.find((item) => item.appKey === value);
        return {
          value,
          name: value === "main" ? "main（主应用）" : value,
          description:
            value === "main"
              ? "唯一访问入口，经 wujie 加载子应用，固定参与"
              : app
                ? `devPort ${app.devPort}`
                : undefined,
          checked: value === "main",
          disabled: value === "main" ? "必选" : false,
        };
      }),
    });

    // 外部子应用未初始化（git submodule 未拉取）时给出友好提示并跳过，而非让 rsbuild 报错
    const uninitialized = appKeys.filter(isUninitializedSubmodule);
    uninitialized.forEach((appKey) => {
      warn(
        `外部子应用 "${appKey}" 尚未初始化，已跳过。请先执行 git submodule update --init 拉取代码。`,
      );
    });
    const validAppKeys = appKeys.filter((appKey) => !uninitialized.includes(appKey));
    if (validAppKeys.length === 0) {
      fail("没有可用的应用模块，操作已取消。");
      process.exit(1);
    }

    const isSingle = validAppKeys.length === 1;
    const commands = validAppKeys.map((appKey) => buildCommand(appKey, mode, isSingle));

    divider();
    ok(`将${verb} ${validAppKeys.length} 个应用：${chalk.bold(validAppKeys.join("、"))}`);
    console.log();

    if (isDev) {
      // dev 模式：长驻进程，并行启动多个
      startDevServers(commands);
      printDevUrls(validAppKeys);
    } else {
      // build 模式：串行构建，输出清晰、资源占用平稳
      commands.forEach((command) =>
        execSync(command, { stdio: "inherit", cwd: ROOT }),
      );
      ok("构建完成");
    }
  } catch (err) {
    fail("操作失败：");
    console.error(err);
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
