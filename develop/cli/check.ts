import { existsSync } from "fs";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import chalk from "chalk";
import apps from "../../apps/apps.json" with { type: "json" };
import { apps as constantApps } from "../../assets/constants/apps";
import { banner, divider, ok, fail } from "./ui";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../");

banner("🔍 TypeScript 类型检查");

// 双清单一致性校验：apps.json 的 appKey 必须在前端常量 constants/apps.ts 中存在同名项
const missing = apps
  .map((app) => app.appKey)
  .filter((key) => !constantApps.some((item) => item.appKey === key));
if (missing.length) {
  fail(
    `apps.json 与 assets/constants/apps.ts 不一致，constants 缺失 appKey：${missing.join("、")}`,
  );
  process.exit(1);
}

/**
 * 待类型检查的工程列表：main 固定参与，子应用从 apps.json 动态读取，
 * 新增/删除子应用（pnpm run create）无需再手动改这里
 * 外部子应用（out 类型）未拉取 submodule 时没有 tsconfig.json，自动跳过
 */
const targets = [
  "main/tsconfig.json",
  ...apps.map((app) => `apps/${app.appKey}/tsconfig.json`),
].filter((tsconfig) => existsSync(path.join(ROOT, tsconfig)));

/** 跑单个工程的类型检查，输出按完成顺序打印，避免并行交错难读 */
const runCheck = (
  tsconfig: string,
): Promise<{ tsconfig: string; code: number | null }> =>
  new Promise((resolve) => {
    const child = spawn("vue-tsc", ["-p", tsconfig, "--noEmit"], {
      cwd: ROOT,
      shell: process.platform === "win32",
    });
    let output = "";
    child.stdout.on("data", (d) => (output += d));
    child.stderr.on("data", (d) => (output += d));
    child.on("close", (code) => {
      console.log(
        `  ${chalk.cyan("▶")} ${tsconfig} ${code === 0 ? chalk.green("✓") : chalk.red("✗")}`,
      );
      if (output.trim()) console.log(output.trimEnd());
      resolve({ tsconfig, code });
    });
  });

const results = await Promise.all(targets.map(runCheck));

divider();
const failed = results.filter((r) => r.code !== 0);
if (failed.length) {
  fail(`以下工程类型检查未通过：${failed.map((r) => r.tsconfig).join("、")}`);
  process.exit(1);
}
ok(`全部 ${targets.length} 个工程类型检查通过`);
