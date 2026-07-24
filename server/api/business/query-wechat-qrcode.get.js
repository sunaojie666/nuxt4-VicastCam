import { defineEventHandler } from 'h3'
import { createVicastApiError, createVicastApiURL } from '../../utils/vicast-api'

const QUERY_WECHAT_QRCODE_PATH = '/v1/queryWechatQrcode'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)

  return $fetch(createVicastApiURL(config.vicastApiUrl, QUERY_WECHAT_QRCODE_PATH)).catch((error) => {
    throw createVicastApiError(error, 'Failed to load the business WeChat QR code')
  })
})
