import JSZip from "jszip";
import fs from "fs-extra";
import path from "path";
import { getNowTime } from "../../assets/utils/time";
export const distZipPlugin = () => ({
  name: "dist-zip",
  setup(api) {
    api.onAfterBuild(async () => {
      const distPath = api.context.distPath;
      const distName = path.basename(distPath);
      const zipDir = path.join(api.context.rootPath, "build", "distZip");
      const zipPath = path.join(
        zipDir,
        `${distName + getNowTime("yyyymmddhhmm")}.zip`,
      );

      // 确保目录存在
      await fs.ensureDir(zipDir);

      // 准备压缩
      const zip = new JSZip();
      await fs.ensureDir(distPath);

      // 递归添加文件
      const addFiles = async (folderPath, zipFolder) => {
        const files = await fs.readdir(folderPath);
        for (const file of files) {
          const fullPath = path.join(folderPath, file);
          if ((await fs.stat(fullPath)).isDirectory()) {
            await addFiles(fullPath, zipFolder.folder(file));
          } else {
            zipFolder.file(file, await fs.readFile(fullPath));
          }
        }
      };

      // 执行压缩
      await addFiles(distPath, zip);
      await fs.writeFile(
        zipPath,
        await zip.generateAsync({ type: "nodebuffer" }),
      );
      console.log(`✅ ZIP生成成功: ${zipPath}`);
    });
  },
});
