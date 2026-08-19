import { createRequest } from './index'

// PayPal 支付接口统一走 Nuxt server/api，避免前端直接绑定真实业务接口域名。
const paypalRequest = createRequest({
  baseURL: '/api/paypal',
  responseScope: 'order',
})

// 套餐类型到后端 product_id 的映射，取值来自 VicastCam 支付接口文档。
const PRODUCT_IDS = {
  month: 'inapp_chips_month',
  year: 'inapp_chips_year',
  life: 'inapp_lifetime_vip',
}

// 后端只认这三个 product_id，页面上的套餐类型或已有 productId 都归一到这里。
export const resolvePaypalProductId = (value) => {
  const text = String(value || '').trim()

  if (Object.values(PRODUCT_IDS).includes(text)) {
    return text
  }

  return PRODUCT_IDS[text.toLowerCase()] || ''
}

// 创建 PayPal 订单。服务端会转发到 https://api.vicastcam.com/v1/paypal/createOrder。
export const createPaypalOrder = (payload = {}) => {
  return paypalRequest.post('/create-order', {
    user_id: String(payload.user_id || '').trim(),
    product_id: resolvePaypalProductId(payload.product_id),
  }, {
    skipGlobalLoading: true,
  })
}

// 查询 PayPal 订单状态。服务端会转发到 https://api.vicastcam.com/v1/paypal/getOrderStatus。
export const getPaypalOrderStatus = (payload = {}) => {
  return paypalRequest.post('/get-order-status', {
    out_trade_no: String(payload.out_trade_no || payload.outTradeNo || '').trim(),
  }, {
    skipGlobalLoading: true,
    skipBusinessCodeValidation: true,
  })
}

// 确认收款。服务端会转发到 https://api.vicastcam.com/v1/paypal/captureOrder。
export const capturePaypalOrder = (payload = {}) => {
  return paypalRequest.post('/capture-order', {
    user_id: String(payload.user_id || '').trim(),
    order_id: String(payload.order_id || '').trim(),
  }, {
    skipGlobalLoading: true,
  })
}
