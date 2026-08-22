import { existsSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import chalk from "chalk";
import apps from "../../apps/apps.json" with { type: "json" };
import { banner, divider, ok } from "./ui";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../");

/**
 * 待类型检查的工程列表：main 固定参与，子应用从 apps.json 动态读取，
 * 新增/删除子应用（pnpm run create）无需再手动改这里
 * 外部子应用（out 类型）未拉取 submodule 时没有 tsconfig.json，自动跳过
 */
const targets = [
  "main/tsconfig.json",
  ...apps.map((app) => `apps/${app.appKey}/tsconfig.json`),
].filter((tsconfig) => existsSync(path.join(ROOT, tsconfig)));

banner("🔍 TypeScript 类型检查");

targets.forEach((tsconfig, index) => {
  console.log(chalk.cyan(`  ▶ [${index + 1}/${targets.length}] ${tsconfig}`));
  execSync(`vue-tsc -p ${tsconfig} --noEmit`, { stdio: "inherit", cwd: ROOT });
});

divider();
ok(`全部 ${targets.length} 个工程类型检查通过`);
