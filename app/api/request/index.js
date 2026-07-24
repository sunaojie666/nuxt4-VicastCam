import axios from 'axios'
import { endSiteLoading, startSiteLoading } from '../../utils/site-loading'
import { handleAuthExpired, isAuthExpiredResponse } from '../../utils/auth-session'
import { createApiResponseError, isApiResponseError } from '../../utils/api-response'

const DEFAULT_TIMEOUT = 10000

// 创建一个独立 axios 实例，避免不同接口模块之间互相污染配置。
export const createRequest = ({ baseURL = '', timeout = DEFAULT_TIMEOUT, headers = {}, responseScope = 'general' } = {}) => {
  const request = axios.create({
    baseURL,
    timeout,
    headers,
  })

  request.interceptors.request.use(
    config => {
      config.responseScope ||= responseScope

      if (process.client && !config.skipGlobalLoading) {
        config.siteLoadingId = startSiteLoading({
          url: `${config.baseURL || ''}${config.url || ''}`,
        })
      }

      return config
    },
    error => Promise.reject(error)
  )

  // HTTP 成功但业务码失败时也统一 reject，页面不再重复维护成功码集合。
  request.interceptors.response.use(
    response => {
      endSiteLoading(response.config?.siteLoadingId)
      const data = response.data
      const responseScope = response.config?.responseScope || 'general'
      const authExpiredHandled = !response.config?.skipAuthExpiredRedirect
        && isAuthExpiredResponse(response.status, data)

      if (authExpiredHandled) {
        handleAuthExpired(data)
      }

      if (!response.config?.skipBusinessCodeValidation && isApiResponseError(data, responseScope)) {
        const normalizedError = createApiResponseError(data, responseScope)
        normalizedError.authExpiredHandled = authExpiredHandled
        return Promise.reject(normalizedError)
      }

      return data
    },
    error => {
      endSiteLoading(error.config?.siteLoadingId)
      const status = error.response?.status || 0
      const data = error.response?.data || null
      const responseScope = error.config?.responseScope || 'general'
      const message = data?.error?.message || data?.data?.message || data?.message || error.message || 'Request failed'
      const authExpiredHandled = !error.config?.skipAuthExpiredRedirect
        && isAuthExpiredResponse(status, data)

      if (authExpiredHandled) {
        handleAuthExpired(data)
      }

      const normalizedError = isApiResponseError(data, responseScope)
        ? createApiResponseError(data, responseScope)
        : new Error(message)

      return Promise.reject(Object.assign(normalizedError, {
        status,
        data,
        responseScope,
        authExpiredHandled,
        raw: error,
      }))
    }
  )

  return request
}

export default createRequest
