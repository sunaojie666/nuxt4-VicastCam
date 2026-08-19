import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const CREATE_PAYPAL_ORDER_PATH = '/v1/paypal/createOrder'

// 创建 PayPal 订单。前端提交 user_id 和 product_id，服务端补齐 Authorization 后转发给 VicastCam。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const user_id = requireVicastParam(requestBody, 'user_id', '用户信息不存在，请重新登录')
    const product_id = requireVicastParam(requestBody, 'product_id', '订阅套餐不存在，请重新选择')

    return requestVicastApi(event, {
      path: CREATE_PAYPAL_ORDER_PATH,
      formData: true,
      auth: true,
      params: {
        user_id,
        product_id,
      },
      errorMessage: '创建订单失败',
    })
  })
})
