import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const GET_VIP_INFO_PATH = '/v1/GetVipInfo'

// 获取会员状态信息。前端提交 user_id，服务端补齐 Authorization 后转发给 VicastCam。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const user_id = requireVicastParam(requestBody, 'user_id', '用户信息不存在，请重新登录')

    return requestVicastApi(event, {
      path: GET_VIP_INFO_PATH,
      formData: true,
      auth: true,
      params: {
        user_id,
      },
      errorMessage: '获取会员状态失败',
    })
  })
})
