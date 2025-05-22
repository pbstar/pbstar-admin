const create = (json) => {
  //首字母大写
  const key = json.childKey.charAt(0).toUpperCase() + json.childKey.slice(1);
  return `
      import ${json.key}Controller from "../controllers/${json.key}.js";
  
      router.post("/${json.key}/get${key}List", ${json.key}Controller.get${key}List);
      router.post("/${json.key}/delete${key}", ${json.key}Controller.delete${key});
      router.post("/${json.key}/create${key}", ${json.key}Controller.create${key});
      router.post("/${json.key}/update${key}", ${json.key}Controller.update${key});
      router.get("/${json.key}/get${key}Detail", ${json.key}Controller.get${key}Detail);
    `;
};
export default {
  create,
};
