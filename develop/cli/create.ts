import { program } from "commander";
import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { replaceInFile } from "replace-in-file";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TEMPLATE_DIR = path.join(__dirname, "../template");
const APPS_DIR = path.join(__dirname, "../../apps");

program
  .version("1.0.0")
  .description("创建一个新的子应用")
  .action(async () => {
    try {
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

      let gitUrl = "";
      if (appType === "out") {
        gitUrl = await input({
          message: "请输入Git仓库地址:",
          validate: (value) => {
            if (value.trim() === "") {
              return "请输入Git仓库地址";
            }
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

      if (fs.existsSync(appPath)) {
        console.error(
          chalk.red(
            `错误: 目录 ${appPath} 已存在，请选择其他名称或删除现有的目录。`,
          ),
        );
        process.exit(1);
      }

      console.log(chalk.blue(`\n创建子应用: ${appKey}`));

      if (appType === "out" && gitUrl) {
        console.log(chalk.blue(`正在添加Git子模块: ${gitUrl}`));
        try {
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

      const appsJsonPath = path.join(APPS_DIR, "apps.json");
      if (fs.existsSync(appsJsonPath)) {
        const appsJson = fs.readJsonSync(appsJsonPath);
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
        const maxPort = Math.max(
          ...appsJson.map((item: { devPort: number }) => item.devPort),
        );
        const port = maxPort + 1;
        if (port < 8801 || port > 8899) {
          console.error(
            chalk.red(
              "错误: 端口号超出范围（ 8801-8899 ），请检测子应用配置（ /pbstar-admin/apps/apps.json ）。",
            ),
          );
          process.exit(1);
        }
        appsJson.push({
          appKey,
          appType,
          devPort: port,
          proUrl: "",
        });
        fs.writeJsonSync(appsJsonPath, appsJson, { spaces: 2 });
      }

      if (appType === "in") {
        fs.mkdirSync(appPath, { recursive: true });
      }

      // 复制模板文件（.gitignore 仅外部子应用需要，先排除）
      await fs.copy(TEMPLATE_DIR, appPath, {
        filter: (src) => !src.endsWith(".gitignore"),
      });

      if (appType === "out") {
        await fs.copy(
          path.join(TEMPLATE_DIR, ".gitignore"),
          path.join(appPath, ".gitignore"),
        );
      }

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
