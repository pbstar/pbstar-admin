/**
 * 数组扁平化
 * @param {Array} arr 要扁平化的数组
 * @param {string} listKey 子数组的键名，默认为'children'
 * @returns {Array} 扁平化后的数组
 */
export function flatten(arr, listKey = "children") {
  const result = [];

  const flattenRecursive = (array) => {
    array.forEach((item) => {
      result.push(item);
      if (Array.isArray(item[listKey])) {
        flattenRecursive(item[listKey]);
      }
    });
  };

  flattenRecursive(arr);
  return result;
}

/**
 * 数组结构化（构建树形结构）
 * @param {Array} arr 要结构化的数组
 * @param {string} pidKey 父节点ID的键名，默认为'parentId'
 * @param {string} idKey 节点ID的键名，默认为'id'
 * @returns {Array} 结构化后的树形数组
 */
export function structure(arr, pidKey = "parentId", idKey = "id") {
  const nodeMap = new Map();
  const tree = [];

  // 创建节点映射
  arr.forEach((item) => {
    nodeMap.set(item[idKey], { ...item });
  });

  // 构建树结构
  arr.forEach((item) => {
    const node = nodeMap.get(item[idKey]);
    const parentNode = nodeMap.get(item[pidKey]);

    if (!parentNode) {
      tree.push(node);
    } else {
      if (!parentNode.children) {
        parentNode.children = [];
      }
      parentNode.children.push(node);
    }
  });

  return tree;
}
