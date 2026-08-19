import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const GET_PAYPAL_ORDER_STATUS_PATH = '/v1/paypal/getOrderStatus'

// 使用商户订单号查询真实支付结果，Authorization 由服务端从登录 cookie 补齐。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const out_trade_no = requireVicastParam(requestBody, 'out_trade_no', '订单号不存在，请重新支付')

    return requestVicastApi(event, {
      path: GET_PAYPAL_ORDER_STATUS_PATH,
      formData: true,
      auth: true,
      params: {
        out_trade_no,
      },
      errorMessage: '查询订单状态失败',
    })
  })
})
