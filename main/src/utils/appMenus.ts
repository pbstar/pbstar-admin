import type { MenuItem } from "@Passets/utils/permission";
import { systemMenus } from "../../../apps/system/src/constants/menus";
import { exampleMenus } from "../../../apps/example/src/constants/menus";

/** appKey -> 该应用的全量硬编码菜单，与 apps/apps.json 的 key 对应；out-app 为外部应用，不在此维护 */
export const appMenuMap: Record<string, MenuItem[]> = {
  system: systemMenus,
  example: exampleMenus,
};
