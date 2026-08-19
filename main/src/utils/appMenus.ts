import type { MenuItem } from "@Passets/utils/permission";
import apps from "../../../apps/apps.json" with { type: "json" };

/** 已加载过的子应用菜单缓存，避免切换应用时重复动态 import */
const menuCache = new Map<string, MenuItem[]>();

/**
 * 动态加载指定子应用的硬编码菜单
 * 各子应用在自己的 src/constants/menus.ts 里 export default 维护，
 * 这里按 apps.json 的 key 动态 import，新增/删除子应用无需再手动改这个文件
 * 内外子应用（in/out）一视同仁：均在自己的 src/constants/menus.ts 维护菜单，统一在此加载
 * @param appKey 应用 key，对应 apps.json 里的 key
 */
export async function loadAppMenus(appKey: string): Promise<MenuItem[]> {
  if (menuCache.has(appKey)) return menuCache.get(appKey)!;
  const app = apps.find((item) => item.key === appKey);
  if (!app) return [];
  try {
    const mod = await import(`../../../apps/${appKey}/src/constants/menus`);
    const menus: MenuItem[] = mod.default ?? [];
    menuCache.set(appKey, menus);
    return menus;
  } catch (err) {
    console.error(`加载子应用【${appKey}】菜单失败:`, err);
    return [];
  }
}
