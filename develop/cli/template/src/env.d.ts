/// <reference types="@rsbuild/core/types" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>;
  export default component;
}

/** 自定义环境变量（构建期注入，见 .env.* 与 rsbuild loadEnv） */
interface ImportMetaEnv {
  readonly PUBLIC_TITLE?: string;
  readonly PUBLIC_FREE_LOGIN?: string;
  readonly PUBLIC_API_BASE_URL?: string;
}

/** 主应用/微前端运行时挂在 window 上的全局 */
interface Window {
  __warnPatched?: boolean;
  $mainPinia?: any;
  $wujie?: any;
  __POWERED_BY_WUJIE__?: boolean;
  __WUJIE_MOUNT?: () => void;
  __WUJIE_UNMOUNT?: () => void;
}
