import { execSync } from "child_process";
import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import apps from "../../apps/apps.json" with { type: "json" };

// 可构建的应用模块列表
const list = ["main", ...apps.map((item) => item.key)];

program
  .version("1.0.0")
  .description("构建应用模块")
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "appKey",
          message: "请选择要构建的应用模块:",
          choices: list,
        },
      ]);
      const { appKey } = answers;
      // 执行构建命令
      const command = `rsbuild build --environment ${appKey}`;
      execSync(command, { stdio: "inherit", cwd: "../" });
    } catch (err) {
      console.error(chalk.red("Error:"), err);
      process.exit(1);
    }
  });

program.parse(process.argv);
