import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const CAPTURE_PAYPAL_ORDER_PATH = '/v1/paypal/captureOrder'

// 确认收款。PayPal 授权成功后提交 order_id，服务端补齐 Authorization 后转发给 VicastCam 完成开通。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const user_id = requireVicastParam(requestBody, 'user_id', '用户信息不存在，请重新登录')
    const order_id = requireVicastParam(requestBody, 'order_id', '订单信息不存在，请重新支付')

    return requestVicastApi(event, {
      path: CAPTURE_PAYPAL_ORDER_PATH,
      formData: true,
      auth: true,
      params: {
        user_id,
        order_id,
      },
      errorMessage: '订单确认失败',
    })
  })
})
