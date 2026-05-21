import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const GET_BUY_RECORDS_PATH = '/v1/GetBuyRecords'

const createPositiveInteger = (value, fallback) => {
  const numberValue = Number.parseInt(value, 10)

  if (Number.isFinite(numberValue) && numberValue > 0) {
    return numberValue
  }

  return fallback
}

// 获取购买记录。token 通过 Authorization 请求头传递，sign 只签业务参数。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const user_id = requireVicastParam(requestBody, 'user_id', '用户信息不存在，请重新登录')

    return requestVicastApi(event, {
      path: GET_BUY_RECORDS_PATH,
      formData: true,
      auth: true,
      params: {
        user_id,
        page: createPositiveInteger(requestBody.page, 1),
        limit: createPositiveInteger(requestBody.limit, 5),
      },
      errorMessage: '获取购买记录失败',
    })
  })
})
