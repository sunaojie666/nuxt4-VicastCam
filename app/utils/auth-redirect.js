// 登录成功后跳转目标：优先使用登录页 redirect 参数（仅允许站内路径），否则回首页。
export const getLoginRedirectPath = () => {
  const route = useRoute()
  const localePath = useLocalePath()
  const target = String(route.query.redirect || route.query.returnUrl || '').trim()

  if (target && target.startsWith('/') && !target.startsWith('//')) {
    return target
  }

  return localePath('/')
}

// 生成带回跳参数的登录页地址，用于未登录用户点击受限操作时跳转。
export const createLoginPath = (path) => {
  const localePath = useLocalePath()
  const loginPath = localePath('/login')
  const normalizedPath = String(path || localePath('/'))
    .split('?')[0]
    .split('#')[0]
  const safePath = normalizedPath.startsWith('/') && !normalizedPath.startsWith('//')
    ? normalizedPath
    : localePath('/')
  const separator = loginPath.includes('?') ? '&' : '?'

  return `${loginPath}${separator}redirect=${encodeURIComponent(safePath)}`
}
