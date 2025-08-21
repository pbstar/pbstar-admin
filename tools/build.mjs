import { runAppCommand } from "./utils.js";

runAppCommand({
  description: "构建应用模块",
  buildCommand: (appKey) => `rsbuild build --environment ${appKey}`,
});
