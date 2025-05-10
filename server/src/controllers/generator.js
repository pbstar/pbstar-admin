import prettier from "prettier";
import main from "./handle/generator/main.js";
import main_detail from "./handle/generator/main_detail.js";
import childTable from "./handle/generator/childTable.js";
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
        });
        const code__detail = main_detail.create(jsonData);
        const formattedCodeDetail = await prettier.format(code__detail, {
          parser: "vue",
        });
        arr.push({
          fileName: `${jsonData.key}_detail.vue`,
          fileCode: formattedCodeDetail,
        });
      } else if (jsonData.template === "childTable") {
        const code = await childTable.create(jsonData);
        const formattedCode = await prettier.format(code, { parser: "vue" });
        arr.push({
          fileName: `${jsonData.key}.vue`,
          fileCode: formattedCode,
        });
      } else if (jsonData.template === "formTable") {
        const code = await formTable.create(jsonData);
        const formattedCode = await prettier.format(code, { parser: "vue" });
        arr.push({
          fileName: `${jsonData.key}.vue`,
          fileCode: formattedCode,
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
