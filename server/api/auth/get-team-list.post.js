import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const GET_TEAM_LIST_PATH = '/v1/GetTeamList'

const createPositiveInteger = (value, fallback) => {
  const numberValue = Number.parseInt(value, 10)

  if (Number.isFinite(numberValue) && numberValue > 0) {
    return numberValue
  }

  return fallback
}

// 获取团队成员列表。前端提交 JSON，服务端按 VicastCam 接口要求转成 query 参数。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const user_id = requireVicastParam(requestBody, 'user_id', '用户信息不存在，请重新登录')
    const level = ['1', '2'].includes(String(requestBody.level)) ? String(requestBody.level) : '1'
    const month = String(requestBody.month || '').trim()

    return requestVicastApi(event, {
      path: GET_TEAM_LIST_PATH,
      method: 'GET',
      auth: true,
      query: {
        user_id,
        level,
        month,
        page_index: createPositiveInteger(requestBody.page_index, 1),
        page_size: createPositiveInteger(requestBody.page_size, 10),
      },
      errorMessage: '获取团队成员失败',
    })
  })
})
