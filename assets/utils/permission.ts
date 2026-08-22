/** 前端硬编码菜单项（各子应用在 constants/menus.ts 里维护）
 *  key 缺省表示纯展示分组节点（如"系统管理"），始终展示，可见性由 children 决定
 */
export interface MenuItem {
  key?: string;
  name: string;
  url?: string | null;
  icon?: string;
  children?: MenuItem[];
}

/**
 * 判断权限 key 是否命中已授权集合
 * @param key 待判断的权限标识，为空视为无需校验，直接放行
 * @param permissions 逗号分隔的已授权 key 字符串，"all" 表示全量放行
 */
export function hasPermission(
  key: string | undefined | null,
  permissions: string | undefined | null,
): boolean {
  if (!key) return true;
  if (permissions === "all") return true;
  if (!permissions) return false;
  const keySet = new Set(
    permissions
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
  );
  return keySet.has(key);
}

/**
 * 按权限过滤硬编码菜单树
 * 叶子节点按自身 key 判断；分组节点（无 key）不做权限校验，只要过滤后仍有可见子节点就保留
 * @param items 硬编码菜单树
 * @param permissions 逗号分隔的已授权 key 字符串
 */
export function filterMenuTree(items: MenuItem[], permissions: string | undefined | null): MenuItem[] {
  const result: MenuItem[] = [];
  for (const item of items) {
    if (item.children?.length) {
      const children = filterMenuTree(item.children, permissions);
      if (children.length) {
        result.push({ ...item, children });
      }
    } else if (hasPermission(item.key, permissions)) {
      result.push(item);
    }
  }
  return result;
}
