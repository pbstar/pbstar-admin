import axios from 'axios'
import { MessagePlugin } from 'tdesign-vue-next';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '../../main/src/router'
import PConfig from '../../config'
import PServer from '../../server'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const StatusCodeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功',
  400: '请求错误(400)',
  401: '未授权，请重新登录(401)',
  403: '拒绝访问(403)',
  404: '请求出错(404)',
  408: '请求超时(408)',
  500: '服务器错误(500)',
  501: '服务未实现(501)',
  502: '网络错误(502)',
  503: '服务不可用(503)',
  504: '网络超时(504)'
}
const http = axios.create({
  baseURL: PConfig.baseURL,
  timeout: 30 * 1000
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    NProgress.start() // 进度条
    const token = localStorage.getItem('token')
    if (token) {
      if (!config.headers) {
        config.headers = {}
      }
      config.headers.token = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    const { data } = response
    const { code } = data

    // token失效
    if (code === 401) {
      NProgress.done()
      MessagePlugin.error('token失效')
      router.replace('/login')
      return Promise.reject(new Error('token失效'))
    }
    NProgress.done()
    return response
  },
  (error) => {
    NProgress.done()
    MessagePlugin.closeAll()
    const response = Object.assign({}, error.response)
    response && MessagePlugin.error(StatusCodeMessage[response.status] || '系统异常, 请检查网络或联系管理员！')
    return Promise.reject(error)
  }
)

const request = (config) => {
  return new Promise((resolve, reject) => {
    if (PConfig.isSimulateServer) {
      const token = localStorage.getItem('token')
      if (token) {
        if (!config.headers) {
          config.headers = {}
        }
        config.headers.token = token
      }
      PServer(config).then(res => resolve(res)).catch(err => reject(err))
    } else {
      http
        .request(config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    }
  })
}

const get = (url, params, config) => {
  return request({
    method: 'get',
    url,
    params,
    ...config
  })
}

const post = (url, params, config) => {
  return request({
    method: 'post',
    url,
    data: params,
    ...config
  })
}

export default { get, post }
