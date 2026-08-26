import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import { isMockEnabled } from "../../develop/mock/persist";
import { matchMock } from "../../develop/mock";

/** 后端统一响应结构 */
export interface Res<T = unknown> {
  code: number;
  msg: string;
  data: T;
}

/** 分页响应结构 */
export interface PageResult<T> {
  list: T[];
  total: number;
}

/** 请求参数（url 必填，data/config 可选） */
export interface RequestParams {
  url: string;
  data?: unknown;
  config?: AxiosRequestConfig;
}

/**
 * 401 统一跳转处理器：由主应用注册（见 main/src/main.ts）；
 * 子应用未注册时经 wujie bus 通知主应用统一跳登录页
 */
let unauthorizedHandler: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: () => void) => {
  unauthorizedHandler = handler;
};

// 「跳转中」标志：并发请求同时 401 时只处理一次，防止重复弹错/重复跳转
let isRedirecting = false;
const handleUnauthorized = () => {
  if (isRedirecting) return;
  isRedirecting = true;
  localStorage.removeItem("p_token");
  ElMessage.error("登录已失效，请重新登录");
  if (unauthorizedHandler) {
    unauthorizedHandler();
  } else {
    window.$wujie?.bus.$emit("unauthorized");
  }
  setTimeout(() => {
    isRedirecting = false;
  }, 1500);
};

// 独立axios实例，避免请求策略（超时/拦截器）相互干扰
const service = axios.create({ timeout: 6000 });

service.interceptors.request.use((config) => {
  const token = localStorage.getItem("p_token");
  if (token) {
    config.headers.set("token", token);
  }
  return config;
});

service.interceptors.response.use(
  (response) => {
    // 业务码层面的登录失效（token 过期），统一清 token 并跳登录页
    if (response.data?.code === 401) {
      handleUnauthorized();
      return Promise.reject(new Error("unauthorized"));
    }
    return response;
  },
  (error) => {
    console.error("请求错误:", error);

    const status = error.response?.status;
    if (status === 401) {
      handleUnauthorized();
    } else if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      ElMessage.error("请求超时！请稍后重试");
    } else if (status === 403) {
      ElMessage.error("无权限访问该资源");
    } else if (status === 404) {
      ElMessage.error("请求的资源不存在");
    } else if (status && status >= 500) {
      ElMessage.error("服务器异常，请稍后重试");
    } else {
      ElMessage.error("请求失败！请稍后重试");
    }

    return Promise.reject(error);
  },
);

const request = async <T = unknown>(config: AxiosRequestConfig): Promise<Res<T>> => {
  const mockRes = isMockEnabled
    ? matchMock(config.method || "get", config.url || "", config.params ?? config.data)
    : null;
  if (mockRes) return mockRes as Promise<Res<T>>;

  const baseURL = config.url?.startsWith("http") ? "" : "/api";

  const response = await service({
    baseURL,
    ...config,
  });
  return response.data as Res<T>;
};

const get = <T = unknown>({ url, data, config = {} }: RequestParams): Promise<Res<T>> => {
  return request<T>({
    method: "get",
    url,
    params: data,
    ...config,
  });
};

const post = <T = unknown>({ url, data, config = {} }: RequestParams): Promise<Res<T>> => {
  return request<T>({
    method: "post",
    url,
    data,
    ...config,
  });
};

const download = async (url: string, fileName: string): Promise<void> => {
  const isSameOrigin =
    url.startsWith("blob:") ||
    new URL(url, window.location.origin).origin === window.location.origin;

  if (isSameOrigin) {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/octet-stream" },
      });

      if (!response.ok) throw new Error("下载失败");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error("下载错误:", error);
      ElMessage.error("下载失败！");
    }
  }
};

export default { get, post, download };
