import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

// 请求拦截器
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("p_token");
  if (token) {
    config.headers["token"] = token;
  }
  return config;
});
// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    console.error(error);
    if (
      error &&
      error.code == "ECONNABORTED" &&
      error.message.indexOf("timeout") != -1
    ) {
      ElMessage.error("请求超时！请您稍后重试");
      return;
    }
    ElMessage.error("请求失败！请您稍后重试");
  },
);
const request = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.token = token;
  }

  let baseUrl = "";
  if (config.url.includes("http")) {
    baseUrl = "";
  } else {
    baseUrl = `/api_${config.base}` || "";
  }
  const conf = {
    baseURL: baseUrl,
    timeout: 6000,
    ...config,
  };

  return new Promise((resolve, reject) => {
    axios(conf)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
const get = ({ base, url, data, config }) => {
  const conf = {
    method: "get",
    base,
    url,
    params: data,
    ...config,
  };
  return request(conf);
};
const post = ({ base, url, data, config }) => {
  const conf = {
    method: "post",
    base,
    url,
    data,
    ...config,
  };
  return request(conf);
};
const download = (url, fileName) => {
  // 如果是同源URL或blob URL，直接使用a标签下载
  if (
    url.startsWith("blob:") ||
    new URL(url).origin === window.location.origin
  ) {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    // 跨域下载使用fetch API
    fetch(url, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/octet-stream",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Download error:", error);
        ElMessage.error("下载失败！");
      });
  }
};

export default { get, post, download };
