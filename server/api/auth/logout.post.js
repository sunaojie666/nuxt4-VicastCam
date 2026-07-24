import { defineEventHandler, deleteCookie } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const LOGOUT_PATH = '/v1/Logout'
const AUTH_TOKEN_COOKIE = 'vicast_auth_token'
const AUTH_USER_COOKIE = 'vicast_auth_user'

const clearAuthCookies = (event) => {
  deleteCookie(event, AUTH_TOKEN_COOKIE, { path: '/' })
  deleteCookie(event, AUTH_USER_COOKIE, { path: '/' })
}

// 通知 VicastCam 后端注销当前用户，并同步清除 Nuxt 服务端维护的登录 Cookie。
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const user_id = requireVicastParam(requestBody, 'user_id', '用户信息不存在，请重新登录')

    return requestVicastApi(event, {
      path: LOGOUT_PATH,
      formData: true,
      auth: true,
      params: {
        user_id,
      },
      errorMessage: '退出登录失败',
    }).finally(() => {
      clearAuthCookies(event)
    })
  })
})
