import Axios from 'axios'
import qs from 'qs'
import Vue from 'vue'

const baseIp = 'http://localhost:8080/'

const cancelToken = Axios.CancelToken
let source = cancelToken.source()

export const CONTENT_TYPE = 'Content-Type'

export const FORM_URLENCODED = 'application/x-www-form-urlencoded; charset=UTF-8'

export const APPLICATION_JSON = 'application/json; charset=UTF-8'

export const TEXT_PLAIN = 'text/plain; charset=UTF-8'

const service = Axios.create({
  baseURL: baseIp,
  timeout: 10 * 60 * 1000,
  withCredentials: true // 跨域请求时发送cookie
})

service.interceptors.request.use(
  config => {
    !config.headers && (config.headers = {})
    if (!config.headers[CONTENT_TYPE]) {
      config.headers[CONTENT_TYPE] = APPLICATION_JSON
    }
    if (config.headers[CONTENT_TYPE] === FORM_URLENCODED) {
      config.data = qs.stringify(config.data)
    }
    config.cancelToken = source.token
    // if (user.getToken()) {
    //   config.headers['Authorization'] = 'token_' + user.getToken()
    // }
    return config
  },
  error => {
    return Promise.reject(error.response)
  }
)

service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error(response.status)
    }
  },
  error => {
    if (process.env.NODE_ENV === 'development') {
      console.log(error)
    }
    switch (error.response.status) {
      case 400:
        error.message = error.response.data.resultDesc || error.response.data.resultCode
        break
      case 401:
        if (Axios.isCancel(error)) {
          return new Promise(() => {})
        } else {
          source.cancel(error.message)
          source = cancelToken.source()
        }
        error.message = 'Unauthorized, please log in'
        router.push({ name: 'login' })
        break
      case 403:
        error.message = 'Access denied'
        router.push({ name: 'login' })
        break
      case 404:
        error.message = `Request address error: ${error.response.config.url}`
        break
      case 408:
        error.message = 'Request timed out'
        break
      case 500:
        error.message = error.response.data.resultDesc
          ? `Server internal error: ${error.response.data.resultDesc}`
          : 'Server internal error'
        break
      case 501:
        error.message = 'Service not implemented'
        break
      case 502:
        error.message = 'Gateway error'
        break
      case 503:
        error.message = 'Service is not available'
        break
      case 504:
        error.message = 'Gateway timeout'
        break
      case 505:
        error.message = 'HTTP version is not supported'
        break
      default:
        break
    }
    Vue.prototype.$errorMsg(error.message)
    return Promise.reject({
      code: error.response.status,
      msg: error.message,
    })
  }
)

export default service
