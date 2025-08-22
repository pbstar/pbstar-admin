import JSZip from "jszip";
import fs from "fs-extra";
import path from "path";
import { getNowTime } from "../../assets/utils/time";

/**
 * 构建后生成zip文件的插件
 */
export const distZipPlugin = () => ({
  name: "dist-zip",
  setup(api) {
    api.onAfterBuild(async () => {
      const { distPath, rootPath } = api.context;
      const distName = path.basename(distPath);
      const zipDir = path.join(rootPath, "build", "distZip");
      const zipPath = path.join(
        zipDir,
        `${distName}${getNowTime("yyyymmddhhmm")}.zip`,
      );

      // 确保目录存在
      await fs.ensureDir(zipDir);

      const zip = new JSZip();

      // 递归添加文件到zip
      const addFilesToZip = async (dirPath, zipFolder) => {
        const items = await fs.readdir(dirPath);

        for (const item of items) {
          const itemPath = path.join(dirPath, item);
          const stats = await fs.stat(itemPath);

          if (stats.isDirectory()) {
            const subFolder = zipFolder.folder(item);
            await addFilesToZip(itemPath, subFolder);
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
