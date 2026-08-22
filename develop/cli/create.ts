import { program } from "commander";
import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { replaceInFile } from "replace-in-file";
import { execSync } from "child_process";

// 获取当前模块路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 定义路径
const TEMPLATE_DIR = path.join(__dirname, "../template");
const APPS_DIR = path.join(__dirname, "../../apps");

// 定义命令
program
  .version("1.0.0")
  .description("创建一个新的子应用")
  .action(async () => {
    try {
      // 交互式问答
      const appType = await select({
        message: "子应用类型:",
        choices: [
          { value: "in", name: "in" },
          { value: "out", name: "out" },
        ],
      });
      const appKey = await input({
        message: "子应用appKey:",
        validate: (value) => {
          const blackList = ["main", "components"];
          if (value.trim() === "") {
            return "请输入子应用appKey";
          }
          if (blackList.includes(value)) {
            return "子应用appKey不能为" + value;
          }
          if (!/^[a-z0-9-]+$/.test(value)) {
            return "子应用appKey只能包含小写字母、数字和连字符";
          }
          return true;
        },
      });
      const appPath = path.join(APPS_DIR, appKey);

      // 如果是外部子应用，询问Git仓库地址
      let gitUrl = "";
      if (appType === "out") {
        gitUrl = await input({
          message: "请输入Git仓库地址:",
          validate: (value) => {
            if (value.trim() === "") {
              return "请输入Git仓库地址";
            }
            // 简单的Git仓库地址验证
            if (
              !value.match(/^https?:\/\/.+\.git$/) &&
              !value.match(/^git@.+:.+\.git$/)
            ) {
              return "请输入有效的Git仓库地址（https或ssh格式）";
            }
            return true;
          },
        });
      }

      // 检查目录是否存在
      if (fs.existsSync(appPath)) {
        console.error(
          chalk.red(
            `错误: 目录 ${appPath} 已存在，请选择其他名称或删除现有的目录。`,
          ),
        );
        process.exit(1);
      }

      console.log(chalk.blue(`\n创建子应用: ${appKey}`));

      // 根据子应用类型选择创建方式
      if (appType === "out" && gitUrl) {
        // 外部子应用：使用git submodule add
        console.log(chalk.blue(`正在添加Git子模块: ${gitUrl}`));
        try {
          // 先进入apps目录，然后执行git submodule add
          execSync(`git submodule add ${gitUrl} apps/${appKey}`, {
            cwd: path.join(__dirname, "../../"),
            stdio: "inherit",
          });
          console.log(chalk.green("Git子模块添加成功!"));
        } catch (error) {
          console.error(
            chalk.red("Git子模块添加失败:"),
            (error as Error).message,
          );
          console.warn(
            chalk.yellow(
              "⚠️  Git子模块添加失败，可能是仓库为空或不存在。如果仓库为空，请先提交一次代码或重新创建带README的仓库。",
            ),
          );
          process.exit(1);
        }
      }

      // apps.json文件中添加子应用配置
      const appsJsonPath = path.join(APPS_DIR, "apps.json");
      if (fs.existsSync(appsJsonPath)) {
        const appsJson = fs.readJsonSync(appsJsonPath);
        // 检查子应用是否已存在
        const appIndex = appsJson.findIndex(
          (item: { appKey: string }) => item.appKey === appKey,
        );
        if (appIndex !== -1) {
          console.error(
            chalk.red(
              `错误: 子应用 ${appKey} 已存在，请选择其他名称或删除现有的子应用。`,
            ),
          );
          process.exit(1);
        }
        // 计算新端口号（从现有最大端口+1）
        const maxPort = Math.max(
          ...appsJson.map((item: { devPort: number }) => item.devPort),
        );
        const port = maxPort + 1;
        // 验证端口号范围（8801-8899）
        if (port < 8801 || port > 8899) {
          console.error(
            chalk.red(
              "错误: 端口号超出范围（ 8801-8899 ），请检测子应用配置（ /pbstar-admin/apps/apps.json ）。",
            ),
          );
          process.exit(1);
        }
        appsJson.push({
          appKey: appKey,
          appType,
          devPort: port,
          proUrl: "",
        });
        fs.writeJsonSync(appsJsonPath, appsJson, { spaces: 2 });
      }

      if (appType === "in") {
        // 创建项目目录
        fs.mkdirSync(appPath, { recursive: true });
      }

      // 复制模板文件（.gitignore 仅外部子应用需要，先排除）
      await fs.copy(TEMPLATE_DIR, appPath, {
        filter: (src) => !src.endsWith(".gitignore"),
      });

      // 外部子应用补充 .gitignore
      if (appType === "out") {
        await fs.copy(
          path.join(TEMPLATE_DIR, ".gitignore"),
          path.join(appPath, ".gitignore"),
        );
      }

      // 更新占位符
      await replaceInFile({
        files: [appPath + "/**/*"],
        from: [/app-template-package-name/g],
        to: [appKey],
      });

      console.log(chalk.green("子应用创建成功!"));
      console.log(chalk.blue("\n下一步:"));
      console.log("  启动子应用: " + chalk.blue("pnpm run dev"));
    } catch (err) {
      console.error(chalk.red("Error creating project:"), err);
      process.exit(1);
    }
  });

program.parse(process.argv);
