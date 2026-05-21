import { defineEventHandler } from 'h3'
import { requestVicastApi } from '../../utils/vicast-api'

const GET_VIP_TYPES_PATH = '/v1/GetVipTypes'

// 获取 VIP 类型。这个接口不需要登录 token。
export default defineEventHandler((event) => {
  return requestVicastApi(event, {
    path: GET_VIP_TYPES_PATH,
    method: 'GET',
    errorMessage: '获取会员套餐失败',
  })
})
