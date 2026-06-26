import { createError } from 'h3'

export const normalizeStrapiApiBaseURL = (url) => {
  return `${String(url || 'http://192.168.18.100:1337').replace(/\/+$/, '')}/api`
}

export const createStrapiApiURL = (baseURL, path = '') => {
  const normalizedPath = String(path || '').replace(/^\/+/, '')

  if (!normalizedPath || normalizedPath.includes('..')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Invalid Strapi path',
      },
    })
  }

  return `${normalizeStrapiApiBaseURL(baseURL)}/${normalizedPath}`
}

export const createStrapiApiError = (error) => {
  const statusCode = error.response?.status || error.statusCode || 502
  const message = error.data?.error?.message || error.data?.message || error.message || 'Strapi request failed'

  return createError({
    statusCode,
    statusMessage: 'Strapi request failed',
    data: {
      message,
      raw: error.data || null,
    },
  })
}
