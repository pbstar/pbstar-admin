/** 树形节点（在源对象基础上追加 children） */
export type TreeNode<T> = T & {
  children?: TreeNode<T>[];
};

/**
 * 数组结构化（构建树形结构）
 * @param arr 要结构化的数组
 * @param pidKey 父节点ID的键名，默认为'parentId'
 * @param idKey 节点ID的键名，默认为'id'
 * @returns 结构化后的树形数组
 */
export function structure<T>(
  arr: T[],
  pidKey: string = "parentId",
  idKey: string = "id",
): TreeNode<T>[] {
  const nodeMap = new Map<unknown, TreeNode<T>>();
  const tree: TreeNode<T>[] = [];
  // 泛型 T 无索引签名，按记录读取节点键值（id/pid 本身为动态键名）
  const get = (item: T, key: string) => (item as Record<string, unknown>)[key];

  arr.forEach((item) => {
    // T 无索引签名，此处仅为初始化节点（children 后续按需挂载），显式断言为 TreeNode
    nodeMap.set(get(item, idKey), { ...item } as TreeNode<T>);
  });

  arr.forEach((item) => {
    const node = nodeMap.get(get(item, idKey));
    const parentNode = nodeMap.get(get(item, pidKey));

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
