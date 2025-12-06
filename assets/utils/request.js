import axios from "axios";
import { ElMessage } from "element-plus";

// 请求拦截器 - 添加token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("p_token");
  if (token) {
    config.headers.token = token;
  }
  return config;
});

// 响应拦截器 - 错误处理
axios.interceptors.response.use(
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

/**
 * 基础请求方法
 * @param {Object} config 请求配置
 * @returns {Promise} 请求结果
 */
const request = (config) => {
  const baseURL = config.url.startsWith("http") ? "" : "/api";

  const requestConfig = {
    baseURL,
    timeout: 6000,
    ...config,
    headers: {
      ...config.headers,
    },
  };

  return axios(requestConfig).then((response) => response.data);
};

/**
 * GET请求
 * @param {Object} param0 请求参数
 * @returns {Promise} 请求结果
 */
const get = ({ url, data, config = {} }) => {
  return request({
    method: "get",
    url,
    params: data,
    ...config,
  });
};

/**
 * POST请求
 * @param {Object} param0 请求参数
 * @returns {Promise} 请求结果
 */
const post = ({ url, data, config = {} }) => {
  return request({
    method: "post",
    url,
    data,
    ...config,
  });
};

/**
 * 文件下载
 * @param {string} url 下载地址
 * @param {string} fileName 文件名
 */
const download = async (url, fileName) => {
  const isSameOrigin =
    url.startsWith("blob:") ||
    new URL(url, window.location.origin).origin === window.location.origin;

  if (isSameOrigin) {
    // 同源下载
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // 跨域下载
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
