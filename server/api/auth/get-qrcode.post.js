import { defineEventHandler } from 'h3'
import { requestVicastApi } from '../../utils/vicast-api'

const GET_QRCODE_PATH = '/v1/GetQrcode'

// Nuxt 服务端代理扫码登录二维码接口，前端切到扫码登录时调用。
export default defineEventHandler((event) => {
  return requestVicastApi(event, {
    path: GET_QRCODE_PATH,
    method: 'GET',
    query: {
      platform: 'pc',
    },
    errorMessage: '获取扫码登录二维码失败',
  })
})
