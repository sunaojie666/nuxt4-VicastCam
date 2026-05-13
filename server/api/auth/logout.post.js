import { deleteCookie, defineEventHandler } from 'h3'

// 清理登录 cookie。前端检测到登录失效时会调用这里，再统一回到首页。
export default defineEventHandler((event) => {
  deleteCookie(event, 'vicast_auth_token', { path: '/' })
  deleteCookie(event, 'vicast_auth_user', { path: '/' })

  return {
    status: 'success',
    code: 200200,
    message: '已退出登录',
  }
})
