import { defineEventHandler } from 'h3'
import { createAuthLoginResult } from '../../utils/auth-response'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const LOGIN_BY_EMAIL_PATH = '/v1/LoginByEmail'

// 邮箱验证码登录代理。前端提交 JSON，服务端转成后端要求的 multipart/form-data。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const email = requireVicastParam(requestBody, 'email')
    const captcha = requireVicastParam(requestBody, 'captcha')

    return requestVicastApi(event, {
      path: LOGIN_BY_EMAIL_PATH,
      formData: true,
      params: {
        email,
        captcha,
      },
      errorMessage: '',
    }).then(
      response => {
        return createAuthLoginResult(event, response)
      }
    )
  })
})
