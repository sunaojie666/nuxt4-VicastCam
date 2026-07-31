import { defineEventHandler, getQuery } from 'h3'
import { createVicastApiError, createVicastApiURL } from '../../utils/vicast-api'

const GET_DOWNLOAD_PATH = '/v1/GetDownload'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const { key } = getQuery(event)
  const downloadKey = String(key || '').trim()

  return $fetch(createVicastApiURL(config.vicastApiUrl, GET_DOWNLOAD_PATH), {
    query: downloadKey ? { key: downloadKey } : undefined,
  }).catch((error) => {
    throw createVicastApiError(error, 'Failed to load platform download config')
  })
})
