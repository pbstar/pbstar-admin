import JSZip from "jszip";
import fs from "fs-extra";
import path from "path";
import dayjs from "dayjs";
import type { RsbuildPlugin } from "@rsbuild/core";

export const distZipPlugin = (): RsbuildPlugin => ({
  name: "dist-zip",
  setup(api) {
    api.onAfterBuild(async () => {
      const { distPath, rootPath } = api.context;
      const distName = path.basename(distPath);
      const zipDir = path.join(rootPath, "develop", "distZip");
      const zipPath = path.join(
        zipDir,
        `${distName}${dayjs().format("YYYYMMDDHHmm")}.zip`,
      );

      await fs.ensureDir(zipDir);

      const zip = new JSZip();

      const addFilesToZip = async (
        dirPath: string,
        zipFolder: JSZip,
      ): Promise<void> => {
        const items = await fs.readdir(dirPath);

        for (const item of items) {
          const itemPath = path.join(dirPath, item);
          const stats = await fs.stat(itemPath);

          if (stats.isDirectory()) {
            const subFolder = zipFolder.folder(item);
            if (subFolder) {
              await addFilesToZip(itemPath, subFolder);
            }
          } else {
            const fileData = await fs.readFile(itemPath);
            zipFolder.file(item, fileData);
          }
        }
      };

      await addFilesToZip(distPath, zip);

      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
      await fs.writeFile(zipPath, zipBuffer);

      console.log(`✅ ZIP生成成功: ${zipPath}`);
    });
  },
});
