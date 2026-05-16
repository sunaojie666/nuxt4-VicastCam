import { defineEventHandler } from 'h3'
import { createAuthLoginResult } from '../../utils/auth-response'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const LOGIN_BY_PASSWORD_PATH = '/v1/LoginByPassword'

// 账号密码登录代理。前端提交 JSON，服务端转成后端要求的 multipart/form-data。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const account = requireVicastParam(requestBody, 'account', 'Missing account')
    const password = requireVicastParam(requestBody, 'password', '请输入密码')

    return requestVicastApi(event, {
      path: LOGIN_BY_PASSWORD_PATH,
      formData: true,
      params: {
        account,
        password,
      },
      errorMessage: '账号密码登录失败',
    }).then(
      response => {
        return createAuthLoginResult(event, response)
      }
    )
  })
})
