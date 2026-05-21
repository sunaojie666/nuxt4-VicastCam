export const authUserCookieName = 'vicast_auth_user'
export const authTokenCookieName = 'vicast_auth_token'

const authExpiredCodes = new Set([401, 403, 100401, 200401, 401000])
const authExpiredMessages = [
  '未登录',
  '请先登录',
  '登录已过期',
  '登录状态失效',
  'token expired',
  'invalid token',
  'unauthorized',
]

export const isLoggedInUser = (user) => {
  return Boolean(user?.user_id || user?.email || user?.nickname)
}

export const clearAuthStorage = () => {
  const authUser = useState('auth-user', () => null)
  const authResponse = useState('auth-response', () => null)
  const authUserCookie = useCookie(authUserCookieName)
  const authTokenCookie = useCookie(authTokenCookieName)

  authUser.value = null
  authResponse.value = null
  authUserCookie.value = null
  authTokenCookie.value = null
}

export const isAuthExpiredResponse = (status, data) => {
  const responseCode = Number(data?.code || data?.data?.code || 0)
  const responseMessage = String(data?.error?.message || data?.data?.message || data?.message || '').toLowerCase()

  if (authExpiredCodes.has(Number(status)) || authExpiredCodes.has(responseCode)) {
    return true
  }

  return authExpiredMessages.some(message => responseMessage.includes(message))
}

const redirectToHome = () => {
  const route = useRoute()
  const localePath = useLocalePath()
  const homePath = localePath('/')

  if (route.path === homePath) {
    return null
  }

  return navigateTo(homePath)
}

// 登录失效统一清状态并回首页。
export const handleAuthExpired = () => {
  clearAuthStorage()

  return redirectToHome()
}
