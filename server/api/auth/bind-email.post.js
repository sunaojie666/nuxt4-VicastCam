import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const BIND_EMAIL_PATH = '/v1/BindEmail'

// 绑定邮箱需要登录态，服务端从 HttpOnly cookie 中带上 VicastCam token。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const user_id = requireVicastParam(requestBody, 'user_id', '用户信息不存在，请重新登录')
    const email = requireVicastParam(requestBody, 'email', '请输入邮箱')
    const captcha = requireVicastParam(requestBody, 'captcha', '请输入验证码')

    return requestVicastApi(event, {
      path: BIND_EMAIL_PATH,
      formData: true,
      auth: true,
      params: {
        user_id,
        email,
        captcha,
      },
      errorMessage: '绑定邮箱失败，请稍后重试',
    })
  })
})
