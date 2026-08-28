import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const REVOKE_CANCEL_PATH = '/v1/RevokeCancel'

// 撤销账号注销。服务端会携带登录 token 转发到 https://api.vicastcam.com/v1/RevokeCancel。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const user_id = requireVicastParam(requestBody, 'user_id', '用户信息不存在，请重新登录')

    return requestVicastApi(event, {
      path: REVOKE_CANCEL_PATH,
      formData: true,
      auth: true,
      params: {
        user_id,
      },
      errorMessage: '撤销注销失败',
    })
  })
})
