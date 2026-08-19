import { execSync } from "child_process";
import { input, select } from "@inquirer/prompts";
import { program } from "commander";
import chalk from "chalk";
import apps from "../../apps/apps.json" with { type: "json" };

// 可选择的工程列表
const list = [
  "全局工程",
  "assets",
  "components",
  "tools",
  "main",
  ...apps.map((item) => item.key),
];

/**
 * 处理依赖包添加/移除
 * @param mode 操作类型
 */
const handleDep = async (mode: "add" | "remove") => {
  const isAdd = mode === "add";
  try {
    const appKey = await select({
      message: isAdd ? "请选择要添加依赖包的工程:" : "请选择要移除依赖包的工程:",
      choices: list.map((key) => ({ value: key, name: key })),
    });
    const packageName = await input({
      message: isAdd ? "请输入要添加的依赖包名称:" : "请输入要移除的依赖包名称:",
    });
    let packageType = "";
    if (isAdd) {
      packageType = await select({
        message: "请选择要添加的依赖包类型:",
        choices: [
          { value: "dependencies", name: "dependencies" },
          { value: "devDependencies", name: "devDependencies" },
        ],
      });
    }
    // 验证依赖包名称
    if (!packageName) {
      console.error(chalk.red("Error: 依赖包名称不能为空"));
      process.exit(1);
    }
    // 构建pnpm命令
    let command = `pnpm ${isAdd ? "add" : "remove"} ${packageName}`;
    if (appKey !== "全局工程") {
      command += ` --filter ${appKey}`;
    } else if (isAdd) {
      command += " -w";
    }
    // 添加开发依赖标识
    if (isAdd && packageType === "devDependencies") {
      command += " -D";
    }
    execSync(command, { stdio: "inherit", cwd: "../" });
  } catch (err) {
    console.error(chalk.red("Error:"), err);
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
