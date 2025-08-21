import { runAppCommand } from "./utils.js";
import apps from "../apps/apps.json" with { type: "json" };

runAppCommand({
  description: "启动应用模块",
  buildCommand: (appKey) => {
    if (appKey === "main") {
      return "rsbuild dev --environment main --port 8800 --open";
    }
    const app = apps.find((item) => item.key === appKey);
    return `rsbuild dev --environment ${appKey} --port ${app.devPort}`;
  },
});
