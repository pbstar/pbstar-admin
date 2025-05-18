const create = (json) => {
  return `
    import ${json.key}Controller from "../controllers/${json.key}.js";

    router.post("/${json.key}/getList", ${json.key}Controller.getList);
    router.post("/${json.key}/delete", ${json.key}Controller.delete);
    router.post("/${json.key}/create", ${json.key}Controller.create);
    router.post("/${json.key}/update", ${json.key}Controller.update);
    router.get("/${json.key}/getDetail", ${json.key}Controller.getDetail);
  `;
};
export default {
  create,
};
