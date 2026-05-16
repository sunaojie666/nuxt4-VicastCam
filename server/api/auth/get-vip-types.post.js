import { defineEventHandler } from 'h3'
import { requestVicastApi } from '../../utils/vicast-api'

const GET_VIP_TYPES_PATH = '/v1/GetVipTypes'

// 获取 VIP 类型。请求参数只需要登录 token，由服务端从 HttpOnly cookie 里取出后放到 Authorization。
export default defineEventHandler((event) => {
  return requestVicastApi(event, {
    path: GET_VIP_TYPES_PATH,
    method: 'GET',
    auth: true,
    errorMessage: '获取会员套餐失败',
  })
})
