import prettier from "prettier";
import cge_main from "./handle/generator/cge_main.js";
import cge_main__detail from "./handle/generator/cge_main__detail.js";
import cge_childTable from "./handle/generator/cge_childTable.js";
import cge_formTable from "./handle/generator/cge_formTable.js";
export default {
  toCreate: async (req, res) => {
    const { jsonData } = req.body;
    try {
      const arr = [];
      if (jsonData.template === "main") {
        const code = await cge_main.create(jsonData);
        const formattedCode = await prettier.format(code, { parser: "vue" });
        arr.push({
          fileName: `${jsonData.key}.vue`,
          fileCode: formattedCode,
        });
        const code__detail = await cge_main__detail.create(jsonData);
        const formattedCodeDetail = await prettier.format(code__detail, {
          parser: "vue",
        });
        arr.push({
          fileName: `${jsonData.key}_detail.vue`,
          fileCode: formattedCodeDetail,
        });
      } else if (jsonData.template === "childTable") {
        const code = await cge_childTable.create(jsonData);
        const formattedCode = await prettier.format(code, { parser: "vue" });
        arr.push({
          fileName: `${jsonData.key}.vue`,
          fileCode: formattedCode,
        });
      } else if (jsonData.template === "formTable") {
        const code = await cge_formTable.create(jsonData);
        const formattedCode = await prettier.format(code, { parser: "vue" });
        arr.push({
          fileName: `${jsonData.key}.vue`,
          fileCode: formattedCode,
        });
        res.status(200).json({
          code: 200,
          msg: "Vue file generated successfully",
          data: arr,
        });
      } else {
        res.status(400).json({
          code: 400,
          msg: "Invalid template type",
          data: null,
        });
      }
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
