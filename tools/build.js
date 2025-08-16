import { execSync } from "child_process";
import apps from "./apps/apps.json";

const list = ["main", ...apps.map((item) => item.key)];

// 定义命令
program
  .version("1.0.0")
  .description("构建应用模块")
  .action(async () => {
    try {
      // 交互式问答
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "appKey",
          message: "请选择要构建的应用模块:",
          choices: list,
        },
      ]);

      const { appKey } = answers;

      if (!appKey) {
        console.error(chalk.red("错误: 请选择要构建的应用模块。"));
        process.exit(1);
      }

      console.log(chalk.blue(`构建应用模块: ${appKey}`));

      const command = `rsbuild build --environment ${appKey}`;

      execSync(command, { stdio: "inherit" });

      console.log(chalk.green(`应用模块 ${appKey} 构建完成`));
    } catch (err) {
      console.error(chalk.red("Error:"), err);
      process.exit(1);
    }
  });

program.parse(process.argv);
