import { defineEventHandler } from 'h3'
import { createAuthLoginResult } from '../../utils/auth-response'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const CHECK_STATUS_PATH = '/v1/CheckStatus'

// 扫码登录状态检查：前端传 uuid，服务端按后端要求转成 multipart/form-data。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const uuid = requireVicastParam(requestBody, 'uuid')

    return requestVicastApi(event, {
      path: CHECK_STATUS_PATH,
      formData: true,
      params: {
        uuid,
      },
      errorMessage: '',
    }).then(
      response => {
        return createAuthLoginResult(event, response)
      }
    )
  })
})
