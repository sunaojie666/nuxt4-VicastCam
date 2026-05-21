import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const GET_COMMISSION_LIST_PATH = '/v1/GetCommissionList'

const createPositiveInteger = (value, fallback) => {
  const numberValue = Number.parseInt(value, 10)

  if (Number.isFinite(numberValue) && numberValue > 0) {
    return numberValue
  }

  return fallback
}

// 获取佣金明细。token 通过 Authorization 请求头传递，sign 只签业务参数。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const user_id = requireVicastParam(requestBody, 'user_id', '用户信息不存在，请重新登录')

    return requestVicastApi(event, {
      path: GET_COMMISSION_LIST_PATH,
      method: 'GET',
      auth: true,
      query: {
        user_id,
        month: String(requestBody.month || '').trim(),
        page_index: createPositiveInteger(requestBody.page_index, 1),
        page_size: createPositiveInteger(requestBody.page_size, 10),
      },
      errorMessage: '获取佣金明细失败',
    })
  })
})
