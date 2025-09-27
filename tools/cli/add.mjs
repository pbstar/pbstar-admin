import { execSync } from "child_process";
import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import apps from "../../apps/apps.json" with { type: "json" };

const list = [
  "全局工程",
  "assets",
  "compontents",
  "tools",
  "main",
  ...apps.map((item) => item.key),
];

program
  .version("1.0.0")
  .description("添加依赖包")
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "appKey",
          message: "请选择要添加依赖包的工程:",
          choices: list,
        },
        {
          type: "input",
          name: "packageName",
          message: "请输入要添加的依赖包名称:",
        },
        {
          type: "list",
          name: "packageType",
          message: "请选择要添加的依赖包类型:",
          choices: ["dependencies", "devDependencies"],
        },
      ]);
      const { appKey, packageName, packageType } = answers;
      if (!packageName) {
        console.error(chalk.red("Error: 依赖包名称不能为空"));
        process.exit(1);
      }
      let command = "";
      if (appKey === "全局工程") {
        command = `pnpm add ${packageName} -w`;
      } else {
        command = `pnpm add ${packageName} --filter ${appKey}`;
      }
      packageType === "devDependencies" && (command += " -D");
      execSync(command, { stdio: "inherit", cwd: "../" });
    } catch (err) {
      console.error(chalk.red("Error:"), err);
      process.exit(1);
    }
  });

program.parse(process.argv);
