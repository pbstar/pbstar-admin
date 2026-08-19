declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>;
  export default component;
}

/** 自定义环境变量（构建期注入，见 .env.* 与 rsbuild loadEnv） */
interface ImportMetaEnv {
  readonly PUBLIC_TITLE?: string;
  readonly PUBLIC_FREE_LOGIN?: string;
  readonly PUBLIC_MOCK?: string;
}
