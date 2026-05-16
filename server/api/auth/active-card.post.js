import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const ACTIVE_CARD_PATH = '/v1/ActiveCard'

// 激活兑换卡。前端提交 JSON，服务端按 VicastCam 接口要求转成 multipart/form-data。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const user_id = requireVicastParam(requestBody, 'user_id', '用户信息不存在，请重新登录')
    const card_pwd = requireVicastParam(requestBody, 'card_pwd', '请输入激活码')

    return requestVicastApi(event, {
      path: ACTIVE_CARD_PATH,
      formData: true,
      auth: true,
      params: {
        user_id,
        card_pwd,
      },
      errorMessage: '激活兑换卡失败',
    })
  })
})
