import { defineEventHandler, deleteCookie } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const ACCOUNT_CANCEL_PATH = '/v1/AccountCancel'
const AUTH_TOKEN_COOKIE = 'vicast_auth_token'
const AUTH_USER_COOKIE = 'vicast_auth_user'

const clearAuthCookies = (event) => {
  deleteCookie(event, AUTH_TOKEN_COOKIE, { path: '/' })
  deleteCookie(event, AUTH_USER_COOKIE, { path: '/' })
}

// 账号注销：后端返回成功即代表注销成功，成功后同步清除登录 Cookie。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const user_id = requireVicastParam(requestBody, 'user_id', '用户信息不存在，请重新登录')

    return requestVicastApi(event, {
      path: ACCOUNT_CANCEL_PATH,
      formData: true,
      auth: true,
      params: {
        user_id,
      },
      errorMessage: '账号注销失败',
    }).then((response) => {
      clearAuthCookies(event)
      return response
    })
  })
})
