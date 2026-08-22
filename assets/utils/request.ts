import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import { isMockEnabled } from "../../develop/mock/persist";
import { matchMock } from "../../develop/mock";

/** 后端统一响应结构 */
export interface Res<T = any> {
  code: number;
  msg: string;
  data: T;
}

/** 请求参数（url 必填，data/config 可选） */
export interface RequestParams {
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
}

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
  (response) => response,
  (error) => {
    console.error("请求错误:", error);

    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      ElMessage.error("请求超时！请稍后重试");
    } else {
      ElMessage.error("请求失败！请稍后重试");
    }

    return Promise.reject(error);
  },
);

const request = async <T = any>(config: AxiosRequestConfig): Promise<Res<T>> => {
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

const get = <T = any>({ url, data, config = {} }: RequestParams): Promise<Res<T>> => {
  return request<T>({
    method: "get",
    url,
    params: data,
    ...config,
  });
};

const post = <T = any>({ url, data, config = {} }: RequestParams): Promise<Res<T>> => {
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
