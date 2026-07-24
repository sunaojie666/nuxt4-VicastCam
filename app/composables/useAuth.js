import { checkScanLoginStatus, getVipInfo, loginByEmailCode, loginByPassword, logout } from '../api/request/auth'
import { authUserCookieName, clearAuthStorage } from '../utils/auth-session'

const getLoginUser = (response) => {
  return response?.user ||
    response?.userinfo ||
    response?.user_info ||
    response?.userInfo ||
    response?.data?.user ||
    response?.data?.userinfo ||
    response?.data?.user_info ||
    response?.data?.userInfo ||
    response?.data ||
    response ||
    null
}

const pickUserValue = (...values) => {
  return values.find(value => value !== undefined && value !== null && value !== '')
}

const createUserText = (...values) => {
  const value = pickUserValue(...values)

  if (value === undefined) {
    return ''
  }

  return String(value)
}

const createUserBoolean = (...values) => {
  const value = pickUserValue(...values)

  if (typeof value === 'boolean') {
    return value
  }

  return ['1', 'true', 'yes'].includes(String(value || '').toLowerCase())
}

const createMissingLoginUserError = (response) => {
  return Object.assign(new Error('loginFailed'), {
    responseKey: 'loginFailed',
    responseScope: 'auth',
    data: response,
  })
}

// 只保留前端展示登录态需要的字段，不把 token 放进可读 cookie。
const createPublicAuthUser = (user) => {
  if (!user || typeof user !== 'object') {
    return null
  }

  return {
    user_id: createUserText(user.user_id, user.uid, user.id),
    nickname: createUserText(user.nickname, user.nick_name, user.nickName, user.username, user.user_name, user.name),
    avatar: createUserText(user.avatar_larger, user.avatar, user.avatar_url, user.avatarUrl, user.head_img, user.headImg, user.headimgurl),
    email: createUserText(user.email),
    mobile: createUserText(user.mobile, user.phone, user.phone_number, user.phoneNumber, user.cellphone),
    industry: createUserText(user.industry, user.occupation, user.profession, user.job),
    gender: createUserText(user.gender, user.sex),
    region: createUserText(user.region, user.area, [user.province, user.city].filter(Boolean).join(' '), user.location, user.address, user.country),
    area: createUserText(user.area, user.region, [user.province, user.city].filter(Boolean).join(' '), user.location, user.address, user.country),
    province: createUserText(user.province),
    city: createUserText(user.city),
    intro: createUserText(user.intro, user.bio, user.profile, user.description, user.signature),
    invite_link: createUserText(user.invite_link, user.inviteLink, user.invitation_link, user.invitationLink, user.referral_link, user.referralLink, user.share_link, user.shareLink),
    invite_code: createUserText(user.invite_code, user.inviteCode, user.invitation_code, user.invitationCode, user.referral_code, user.referralCode),
    vip_type: createUserText(user.vip_type, user.vipType, user.vip_level, user.vipLevel),
    vip_endtime: createUserText(user.vip_endtime, user.vipEndtime, user.vip_end_time, user.vipEndTime),
    has_password: createUserBoolean(user.has_password, user.hasPassword),
  }
}

// 登录态集中放在这里，后续 Header、个人中心和路由守卫都读取同一份状态。
export const useAuth = () => {
  const authUserCookie = useCookie(authUserCookieName, {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  })
  const authUser = useState('auth-user', () => createPublicAuthUser(authUserCookie.value))
  const authResponse = useState('auth-response', () => null)

  const saveAuthFromResponse = (response, { requireUser = false } = {}) => {
    const user = createPublicAuthUser(getLoginUser(response))

    if (requireUser && !user?.user_id) {
      return null
    }

    authResponse.value = response
    authUser.value = user
    authUserCookie.value = user

    return user
  }

  const mergeAuthUser = (user = {}) => {
    const nextUser = createPublicAuthUser({
      ...(authUser.value || {}),
      ...user,
    })

    if (!nextUser) {
      return null
    }

    authUser.value = nextUser
    authUserCookie.value = nextUser

    return nextUser
  }

  const loginWithEmailCode = (payload) => {
    return loginByEmailCode(payload).then((response) => {
      const user = saveAuthFromResponse(response, {
        requireUser: true,
      })

      if (!user) {
        return Promise.reject(createMissingLoginUserError(response))
      }

      return response
    })
  }

  const loginWithPassword = (payload) => {
    return loginByPassword(payload).then((response) => {
      const user = saveAuthFromResponse(response, {
        requireUser: true,
      })

      if (!user) {
        return Promise.reject(createMissingLoginUserError(response))
      }

      return response
    })
  }

  const loginWithScanQrcode = (uuid) => {
    return checkScanLoginStatus(uuid).then((response) => {
      const user = saveAuthFromResponse(response, {
        requireUser: true,
      })

      return {
        response,
        user,
      }
    })
  }

  const refreshVipInfo = () => {
    const user_id = authUser.value?.user_id

    if (!user_id) {
      return Promise.resolve(null)
    }

    return getVipInfo({
      user_id,
    }).then((response) => {
      mergeAuthUser(getLoginUser(response) || {})
      return response
    })
  }

  const clearAuth = () => {
    clearAuthStorage()
  }

  const logoutUser = () => {
    const user_id = authUser.value?.user_id

    if (!user_id) {
      clearAuth()
      return Promise.resolve(null)
    }

    return logout({ user_id }).finally(() => {
      clearAuth()
    })
  }

  return {
    authUser,
    authResponse,
    loginWithEmailCode,
    loginWithPassword,
    loginWithScanQrcode,
    refreshVipInfo,
    mergeAuthUser,
    logoutUser,
    clearAuth,
  }
}
