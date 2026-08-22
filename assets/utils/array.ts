/** 树形节点（在源对象基础上追加 children） */
export type TreeNode<T extends Record<string, any>> = T & {
  children?: TreeNode<T>[];
};

/**
 * 数组结构化（构建树形结构）
 * @param arr 要结构化的数组
 * @param pidKey 父节点ID的键名，默认为'parentId'
 * @param idKey 节点ID的键名，默认为'id'
 * @returns 结构化后的树形数组
 */
export function structure<T extends Record<string, any>>(
  arr: T[],
  pidKey: string = "parentId",
  idKey: string = "id",
): TreeNode<T>[] {
  const nodeMap = new Map<any, TreeNode<T>>();
  const tree: TreeNode<T>[] = [];

  arr.forEach((item) => {
    nodeMap.set(item[idKey], { ...item });
  });

  arr.forEach((item) => {
    const node = nodeMap.get(item[idKey]);
    const parentNode = nodeMap.get(item[pidKey]);

    if (!parentNode) {
      tree.push(node!);
    } else {
      if (!parentNode.children) {
        parentNode.children = [];
      }
      parentNode.children.push(node!);
    }
  });

  return tree;
}
