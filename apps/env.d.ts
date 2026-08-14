/** 主应用/微前端运行时挂在 window 上的全局（与各子应用 env.d.ts 保持一致） */
interface Window {
  __warnPatched?: boolean;
  $mainPinia?: any;
  $wujie?: any;
  __POWERED_BY_WUJIE__?: boolean;
  __WUJIE_MOUNT?: () => void;
  __WUJIE_UNMOUNT?: () => void;
}
