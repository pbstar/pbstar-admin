import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { input, select } from "@inquirer/prompts";
import { program } from "commander";
import chalk from "chalk";
import apps from "../../apps/apps.json" with { type: "json" };
import { banner, divider, ok, fail } from "./ui";

// 仓库根目录：由 import.meta.url 推导，避免依赖进程 cwd
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../");

const projects = [
  "全局工程",
  "assets",
  "components",
  "develop",
  "main",
  ...apps.map((item) => item.appKey),
];

const handleDep = async (mode: "add" | "remove") => {
  const isAdd = mode === "add";
  banner(isAdd ? "📦 添加依赖包" : "🗑 移除依赖包");
  try {
    const currentValue = await select({
      message: isAdd
        ? "请选择要添加依赖包的工程"
        : "请选择要移除依赖包的工程",
      choices: projects.map((value) => ({ value, name: value })),
    });
    const packageName = await input({
      message: isAdd
        ? "请输入要添加的依赖包名称"
        : "请输入要移除的依赖包名称",
    });
    let packageType = "";
    if (isAdd) {
      packageType = await select({
        message: "请选择要添加的依赖包类型",
        choices: [
          { value: "dependencies", name: "dependencies" },
          { value: "devDependencies", name: "devDependencies" },
        ],
      });
    }
    if (!packageName) {
      fail("依赖包名称不能为空");
      process.exit(1);
    }
    let command = `pnpm ${isAdd ? "add" : "remove"} ${packageName}`;
    if (currentValue !== "全局工程") {
      command += ` --filter ${currentValue}`;
    } else if (isAdd) {
      command += " -w";
    }
    if (isAdd && packageType === "devDependencies") {
      command += " -D";
    }
    divider();
    ok(`执行：${chalk.cyan(command)}`);
    execSync(command, { stdio: "inherit", cwd: ROOT });
  } catch (err) {
    fail("操作失败：");
    console.error(err);
    process.exit(1);
  }
};

program
  .version("1.0.0")
  .description("管理依赖包")
  .command("add")
  .description("添加依赖包")
  .action(() => handleDep("add"))
  .command("remove")
  .description("移除依赖包")
  .action(() => handleDep("remove"));

program.parse(process.argv);
