import { existsSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import chalk from "chalk";
import apps from "../../apps/apps.json" with { type: "json" };

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../");

/**
 * 待类型检查的工程列表：main 固定参与，子应用从 apps.json 动态读取，
 * 新增/删除子应用（pnpm run create）无需再手动改这里
 * 外部子应用（out 类型）未拉取 submodule 时没有 tsconfig.json，自动跳过
 */
const targets = [
  "main/tsconfig.json",
  ...apps.map((app) => `apps/${app.key}/tsconfig.json`),
].filter((tsconfig) => existsSync(path.join(ROOT, tsconfig)));

targets.forEach((tsconfig) => {
  console.log(chalk.cyan(`\n▶ check: ${tsconfig}`));
  execSync(`vue-tsc -p ${tsconfig} --noEmit`, { stdio: "inherit", cwd: ROOT });
});

console.log(chalk.green("\n✅ 全部工程类型检查通过"));
