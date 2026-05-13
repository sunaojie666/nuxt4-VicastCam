import { authUserCookieName, clearAuthStorage, isLoggedInUser } from '../utils/auth-session'

export default defineNuxtRouteMiddleware(() => {
  const authUserCookie = useCookie(authUserCookieName)
  const authUser = useState('auth-user', () => authUserCookie.value)

  if (isLoggedInUser(authUser.value || authUserCookie.value)) {
    return
  }

  clearAuthStorage()

  const localePath = useLocalePath()

  return navigateTo(localePath('/'))
})
