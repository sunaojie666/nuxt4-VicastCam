import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const VALID_CAPTCHA_PATH = '/v1/ValidCaptcha'

// 邮箱验证码校验代理。前端提交 JSON，服务端转成后端要求的 multipart/form-data。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const user_id = requireVicastParam(requestBody, 'user_id')
    const captcha = requireVicastParam(requestBody, 'captcha')
    const type = String(requestBody.type || 'cancel').trim()

    return requestVicastApi(event, {
      path: VALID_CAPTCHA_PATH,
      formData: true,
      params: {
        user_id,
        captcha,
        type,
      },
      errorMessage: '验证码校验失败',
    })
  })
})
