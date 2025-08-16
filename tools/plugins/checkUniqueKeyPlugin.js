import { globby } from "globby";
import { readFileSync } from "node:fs";

export const checkUniqueKeyPlugin = (options = {}) => ({
  name: "check-unique-key",
  setup(api) {
    if (!options || options == {}) return;
    const { checkPath, checkKeys } = options;
    if (!checkPath || !checkKeys) {
      throw new Error(
        `[checkUniqueKeyPlugin] checkPath and checkKeys are required`,
      );
    }

    api.onBeforeBuild(async () => {
      // 扫描文件
      const files = await globby([checkPath + "/**/*.vue"], {
        cwd: process.cwd(),
        absolute: true,
        ignore: [checkPath + "/**/node_modules/**"],
      });

      const keys = new Map();

      for (const file of files) {
        const content = readFileSync(file, "utf-8");
        for (const attributeName of checkKeys) {
          const regex = new RegExp(
            `<[^>]*(?:v-bind:)?${attributeName}=["']([^"']+)["'][^>]*>`,
            "gsi",
          );
          for (const match of content.matchAll(regex)) {
            const key = match[1]?.trim();
            if (!key) continue;
            if (keys.has(key)) {
              throw new Error(
                `[Unique Key Conflict] ${file} Duplicate key: "${attributeName}: ${key}`,
              );
            }
            keys.set(key, file);
          }
        }
      }
      console.log(`[Unique Key Check] Check completed.`);
    });
  },
});
