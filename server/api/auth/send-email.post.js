import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const SEND_EMAIL_PATH = '/v1/SendEmail'

// Nuxt 服务端代理邮箱验证码接口，前端只需要调用 /api/auth/send-email。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const email = requireVicastParam(requestBody, 'email', '请输入邮箱')

    return requestVicastApi(event, {
      path: SEND_EMAIL_PATH,
      params: {
        ...requestBody,
        email,
      },
      errorMessage: '邮箱验证码发送失败',
    })
  })
})
