import { globby } from "globby";
import { readFileSync } from "node:fs";

/**
 * 检查Vue文件中重复key的插件
 * @param {Object} options 配置选项
 * @param {string} options.checkPath 检查路径
 * @param {string[]} options.checkKeys 要检查的属性名数组
 */
export const checkUniqueKeyPlugin = (options = {}) => ({
  name: "check-unique-key",
  setup(api) {
    const { checkPath, checkKeys } = options;

    if (!checkPath || !checkKeys) {
      throw new Error(
        "[checkUniqueKeyPlugin] checkPath and checkKeys are required",
      );
    }

    api.onBeforeBuild(async () => {
      const files = await globby([`${checkPath}/**/*.vue`], {
        cwd: process.cwd(),
        absolute: true,
        ignore: [`${checkPath}/**/node_modules/**`],
      });

      const keyMap = new Map();

      for (const file of files) {
        const content = readFileSync(file, "utf-8");

        for (const attr of checkKeys) {
          const regex = new RegExp(`${attr}=["']([^"']+)["']`, "gi");
          const matches = content.matchAll(regex);

          for (const match of matches) {
            const key = match[1]?.trim();
            if (!key) continue;

            if (keyMap.has(key)) {
              throw new Error(
                `[Unique Key Conflict] ${file} 重复key: "${attr}: ${key}"`,
              );
            }
            keyMap.set(key, file);
          }
        }
      }

      console.log(`[Unique Key Check] 检查完成，共检查 ${files.length} 个文件`);
    });
  },
});
