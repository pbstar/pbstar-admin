import { program } from "commander";
import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { replaceInFile } from "replace-in-file";
import { execSync } from "child_process";
import { banner, step, divider, ok, warn, fail } from "./ui";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TEMPLATE_DIR = path.join(__dirname, "../template");
const APPS_DIR = path.join(__dirname, "../../apps");

/** 校验 appKey：非空、避开保留名、仅小写字母/数字/连字符 */
const validateAppKey = (value: string): string | boolean => {
  const blackList = ["main", "components"];
  if (value.trim() === "") return "请输入子应用appKey";
  if (blackList.includes(value)) return `子应用appKey不能为 ${value}`;
  if (!/^[a-z0-9-]+$/.test(value))
    return "子应用appKey只能包含小写字母、数字和连字符";
  return true;
};

/** 校验 git 仓库地址（https 或 ssh 格式，.git 结尾） */
const validateGitUrl = (value: string): string | boolean => {
  if (value.trim() === "") return "请输入Git仓库地址";
  if (!value.match(/^https?:\/\/.+\.git$/) && !value.match(/^git@.+:.+\.git$/))
    return "请输入有效的Git仓库地址（https或ssh格式）";
  return true;
};

program
  .version("1.0.0")
  .description("创建一个新的子应用")
  .action(async () => {
    banner("🔧 创建新子应用");
    try {
      step(1, 3, "选择子应用类型");
      const appType = await select({
        message: "子应用类型",
        choices: [
          { value: "in", name: "in（内部子应用，随主仓库维护）" },
          { value: "out", name: "out（外部子应用，独立 git 仓库）" },
        ],
      });

      step(2, 3, "填写子应用 appKey");
      const appKey = await input({
        message: "子应用appKey",
        validate: validateAppKey,
      });
      if (fs.existsSync(path.join(APPS_DIR, appKey))) {
        fail(`目录 ${appKey} 已存在，请选择其他名称或删除现有的目录。`);
        process.exit(1);
      }

      let gitUrl = "";
      if (appType === "out") {
        step(3, 3, "填写Git仓库地址（外部子应用）");
        gitUrl = await input({
          message: "Git仓库地址",
          validate: validateGitUrl,
        });
      }

      ok(`创建子应用：${appKey}`);

      if (appType === "out" && gitUrl) {
        ok(`添加 Git 子模块：${gitUrl}`);
        try {
          execSync(`git submodule add ${gitUrl} apps/${appKey}`, {
            cwd: path.join(__dirname, "../../"),
            stdio: "inherit",
          });
        } catch (error) {
          fail("Git 子模块添加失败：");
          console.error((error as Error).message);
          warn(
            "失败原因可能为仓库为空或不存在。如果仓库为空，请先提交一次代码，或重新创建带README的仓库。",
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
          fail(`子应用 ${appKey} 已存在，请选择其他名称或删除现有的子应用。`);
          process.exit(1);
        }
        const maxPort = Math.max(
          ...appsJson.map((item: { devPort: number }) => item.devPort),
        );
        const port = maxPort + 1;
        if (port < 8801 || port > 8899) {
          fail(
            "端口号超出范围（ 8801-8899 ），请检测子应用配置（ /pbstar-admin/apps/apps.json ）。",
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
        fs.mkdirSync(path.join(APPS_DIR, appKey), { recursive: true });
      }

      // 复制模板文件（.gitignore 仅外部子应用需要，先排除）
      await fs.copy(TEMPLATE_DIR, path.join(APPS_DIR, appKey), {
        filter: (src) => !src.endsWith(".gitignore"),
      });

      if (appType === "out") {
        await fs.copy(
          path.join(TEMPLATE_DIR, ".gitignore"),
          path.join(APPS_DIR, appKey, ".gitignore"),
        );
      }

      await replaceInFile({
        files: [path.join(APPS_DIR, appKey) + "/**/*"],
        from: [/app-template-package-name/g],
        to: [appKey],
      });

      divider();
      ok("子应用创建成功");
      console.log("  下一步：");
      console.log(
        `  ${chalk.cyan("➜")}  ${chalk.cyan("pnpm run dev")}  启动子应用`,
      );
    } catch (err) {
      fail("创建失败：");
      console.error(err);
      process.exit(1);
    }
  });

program.parse(process.argv);
