import { execSync } from "child_process";
import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import apps from "../../apps/apps.json" with { type: "json" };

const list = ["main", ...apps.map((item) => item.key)];

program
  .version("1.0.0")
  .description("启动应用模块")
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "appKey",
          message: "请选择要启动的应用模块:",
          choices: list,
        },
      ]);
      const { appKey } = answers;
      let command = "";
      if (appKey === "main") {
        command = "rsbuild dev --environment main --port 8800 --open";
      } else {
        const app = apps.find((item) => item.key === appKey);
        command = `rsbuild dev --environment ${appKey} --port ${app.devPort}`;
      }
      execSync(command, { stdio: "inherit", cwd: "../../" });
    } catch (err) {
      console.error(chalk.red("Error:"), err);
      process.exit(1);
    }
  });

program.parse(process.argv);
