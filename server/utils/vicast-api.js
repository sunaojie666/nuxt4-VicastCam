import { createError, readBody } from 'h3'

// 兼容环境变量里是否带尾部斜杠，避免拼接出双斜杠。
export const normalizeVicastApiBaseURL = (url) => {
  return String(url || 'https://api.vicastcam.com').replace(/\/+$/, '')
}

export const createVicastApiURL = (baseURL, path) => {
  return `${normalizeVicastApiBaseURL(baseURL)}${path}`
}

export const isPlainObject = (value) => {
  return value && typeof value === 'object' && !Array.isArray(value)
}

const isVicastUploadFile = (value) => {
  return isPlainObject(value) && value.data && value.filename
}

export const createVicastFormData = (params) => {
  const formData = new FormData()

  Object.entries(params || {}).forEach(([key, value]) => {
    if (isVicastUploadFile(value)) {
      const file = new Blob([value.data], {
        type: value.type || 'application/octet-stream',
      })
      formData.append(key, file, value.filename)
      return
    }

    formData.append(key, String(value))
  })

  return formData
}

export const readVicastBody = (event) => {
  return readBody(event).then((body) => {
    return isPlainObject(body) ? body : {}
  })
}

export const requireVicastParam = (params, key, message) => {
  const value = String(params?.[key] || '').trim()

  if (!value) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message,
      },
    })
  }

  return value
}

export const createVicastApiError = (error, fallbackMessage = 'VicastCam 接口请求失败') => {
  const statusCode = error.response?.status || error.statusCode || 502
  const message = error.data?.error?.message || error.data?.message || error.message || fallbackMessage

  return createError({
    statusCode,
    statusMessage: 'Vicast API request failed',
    data: {
      message,
      raw: error.data || null,
    },
  })
}

// 统一请求 VicastCam 业务接口：自动拼域名、自动转 FormData、统一错误结构。
export const requestVicastApi = (event, {
  path,
  params = {},
  query = {},
  method = 'POST',
  formData = false,
  errorMessage = 'VicastCam 接口请求失败',
} = {}) => {
  const config = useRuntimeConfig(event)
  const requestMethod = String(method || 'POST').toUpperCase()
  const body = formData ? createVicastFormData(params) : params
  const options = {
    method: requestMethod,
    query,
  }

  if (requestMethod !== 'GET') {
    options.body = body
  }

  return $fetch(createVicastApiURL(config.vicastApiUrl, path), options).then(
    response => response,
    error => {
      throw createVicastApiError(error, errorMessage)
    }
  )
}
