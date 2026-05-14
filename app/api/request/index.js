import axios from 'axios'
import { endSiteLoading, startSiteLoading } from '../../utils/site-loading'
import { handleAuthExpired, isAuthExpiredResponse } from '../../utils/auth-session'

const DEFAULT_TIMEOUT = 10000

// 创建一个独立 axios 实例，避免不同接口模块之间互相污染配置。
export const createRequest = ({ baseURL = '', timeout = DEFAULT_TIMEOUT, headers = {} } = {}) => {
  const request = axios.create({
    baseURL,
    timeout,
    headers,
  })

  request.interceptors.request.use(
    config => {
      if (process.client && !config.skipGlobalLoading) {
        config.siteLoadingId = startSiteLoading({
          url: `${config.baseURL || ''}${config.url || ''}`,
        })
      }

      return config
    },
    error => Promise.reject(error)
  )

  // 成功时只返回接口数据；失败时统一整理成带 status/data/raw 的 Error。
  request.interceptors.response.use(
    response => {
      endSiteLoading(response.config?.siteLoadingId)
      return response.data
    },
    error => {
      endSiteLoading(error.config?.siteLoadingId)
      const status = error.response?.status || 0
      const data = error.response?.data || null
      const message = data?.error?.message || data?.data?.message || data?.message || error.message || 'Request failed'

      if (!error.config?.skipAuthExpiredRedirect && isAuthExpiredResponse(status, data)) {
        handleAuthExpired()
      }

      return Promise.reject(Object.assign(new Error(message), {
        status,
        data,
        raw: error,
      }))
    }
  )

  return request
}

export default createRequest
