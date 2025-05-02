export const toTree = (arr) => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    return [];
  }
  const tree = [];
  const map = new Map();
  arr.forEach((item) => map.set(item.id, { ...item }));
  arr.forEach((item) => {
    const parent = map.get(item.parentId);
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(map.get(item.id));
    } else {
      tree.push(map.get(item.id));
    }
  });
  return tree;
};
