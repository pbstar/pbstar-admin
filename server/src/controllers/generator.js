import prettier from "prettier";
import main from "./handle/generator/main.js";
import main_detail from "./handle/generator/main_detail.js";
import main_route from "./handle/generator/main_route.js";
import main_s_route from "./handle/generator/main_s_route.js";
import main_s_controller from "./handle/generator/main_s_controller.js";
import childTable from "./handle/generator/childTable.js";
import childTable_s_route from "./handle/generator/childTable_s_route.js";
import childTable_s_controller from "./handle/generator/childTable_s_controller.js";
import formTable from "./handle/generator/formTable.js";
export default {
  toCreate: async (req, res) => {
    const jsonData = req.body;
    try {
      const arr = [];
      if (jsonData.template === "main") {
        const code = main.create(jsonData);
        const formattedCode = await prettier.format(code, { parser: "vue" });
        arr.push({
          fileName: `${jsonData.key}.vue`,
          fileCode: formattedCode,
          fileType: "vue",
        });
        const code__detail = main_detail.create(jsonData);
        const formattedCodeDetail = await prettier.format(code__detail, {
          parser: "vue",
        });
        arr.push({
          fileName: `${jsonData.key}_detail.vue`,
          fileCode: formattedCodeDetail,
          fileType: "vue",
        });
        const code__route = main_route.create(jsonData);
        const formattedCodeRoute = code__route;
        arr.push({
          fileName: `${jsonData.key}_route.js`,
          fileCode: formattedCodeRoute,
          fileType: "js",
        });
        const code__s_route = main_s_route.create(jsonData);
        const formattedCodeSRoute = await prettier.format(code__s_route, {
          parser: "espree",
        });
        arr.push({
          fileName: `${jsonData.key}_s_route.js`,
          fileCode: formattedCodeSRoute,
          fileType: "js",
        });
        const code__s_controller = main_s_controller.create(jsonData);
        const formattedCodeSController = await prettier.format(
          code__s_controller,
          { parser: "espree" },
        );
        arr.push({
          fileName: `${jsonData.key}_s_controller.js`,
          fileCode: formattedCodeSController,
          fileType: "js",
        });
      } else if (jsonData.template === "childTable") {
        const code = childTable.create(jsonData);
        const formattedCode = await prettier.format(code, { parser: "vue" });
        arr.push({
          fileName: `${jsonData.childKey}.vue`,
          fileCode: formattedCode,
          fileType: "vue",
        });
        const code__s_route = childTable_s_route.create(jsonData);
        const formattedCodeSRoute = await prettier.format(code__s_route, {
          parser: "espree",
        });
        arr.push({
          fileName: `${jsonData.childKey}_s_route.js`,
          fileCode: formattedCodeSRoute,
          fileType: "js",
        });
        const code__s_controller = childTable_s_controller.create(jsonData);
        const formattedCodeSController = await prettier.format(
          code__s_controller,
          { parser: "espree" },
        );
        arr.push({
          fileName: `${jsonData.childKey}_s_controller.js`,
          fileCode: formattedCodeSController,
          fileType: "js",
        });
      } else if (jsonData.template === "formTable") {
        const code = formTable.create(jsonData);
        const formattedCode = await prettier.format(code, { parser: "vue" });
        arr.push({
          fileName: `${jsonData.childKey}.vue`,
          fileCode: formattedCode,
          fileType: "vue",
        });
      } else {
        res.status(400).json({
          code: 400,
          msg: "Invalid template type",
          data: null,
        });
        return;
      }
      res.status(200).json({
        code: 200,
        msg: "生成成功",
        data: arr,
      });
    } catch (error) {
      console.error("Error generating Vue file:", error);
      res.status(500).json({
        code: 500,
        msg: "Error generating Vue file",
        data: error,
      });
    }
  },
};
