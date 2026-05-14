import { checkScanLoginStatus, loginByEmailCode, loginByPassword, updateUserProfile as requestUpdateUserProfile } from '../api/request/auth'
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

const getLoginErrorMessage = (response) => {
  return response?.error?.message ||
    response?.data?.error?.message ||
    response?.message ||
    response?.data?.message ||
    ''
}

const successResponseCodes = new Set([0, 200, 200001, 200200])
const successResponseStatus = new Set(['success', 'ok', 'succeed'])

const getResponseCode = (response) => {
  return pickUserValue(response?.code, response?.data?.code)
}

const getResponseStatus = (response) => {
  return String(pickUserValue(response?.status, response?.data?.status) || '').toLowerCase()
}

const isBusinessFailedResponse = (response) => {
  const code = getResponseCode(response)
  const status = getResponseStatus(response)

  if (response?.error || response?.data?.error) {
    return true
  }

  if (code !== undefined && !successResponseCodes.has(Number(code))) {
    return true
  }

  return Boolean(status && !successResponseStatus.has(status))
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

const setAuthPatchValue = (target, key, value) => {
  if (value !== undefined && value !== null) {
    target[key] = value
  }
}

const createAuthPatchFromUpdatePayload = (payload = {}) => {
  const patch = {}

  setAuthPatchValue(patch, 'user_id', payload.user_id)
  setAuthPatchValue(patch, 'nickname', payload.nickname)
  setAuthPatchValue(patch, 'intro', payload.intro)
  setAuthPatchValue(patch, 'industry', payload.industry)
  setAuthPatchValue(patch, 'gender', payload.gender)
  setAuthPatchValue(patch, 'region', payload.area)
  setAuthPatchValue(patch, 'area', payload.area)
  setAuthPatchValue(patch, 'mobile', payload.mobile)
  setAuthPatchValue(patch, 'email', payload.email)

  return patch
}

const getUpdateResponsePatch = (response, requestPayload, currentUser = {}) => {
  return {
    ...createAuthPatchFromUpdatePayload(requestPayload),
    ...(getLoginUser(response) || {}),
    user_id: requestPayload.user_id || currentUser.user_id || '',
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

    if (import.meta.client) {
      console.log('登录用户资料:', user)
    }

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
        return Promise.reject(Object.assign(new Error(getLoginErrorMessage(response)), {
          data: response,
        }))
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
        return Promise.reject(Object.assign(new Error(getLoginErrorMessage(response)), {
          data: response,
        }))
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

  const updateUserProfile = (payload = {}) => {
    const requestPayload = {
      ...payload,
      user_id: payload.user_id || authUser.value?.user_id || '',
    }

    return requestUpdateUserProfile(requestPayload).then((response) => {
      if (isBusinessFailedResponse(response)) {
        return Promise.reject(Object.assign(new Error(getLoginErrorMessage(response)), {
          data: response,
        }))
      }

      mergeAuthUser(getUpdateResponsePatch(response, requestPayload, authUser.value || {}))

      return response
    })
  }

  const clearAuth = () => {
    clearAuthStorage()
  }

  return {
    authUser,
    authResponse,
    loginWithEmailCode,
    loginWithPassword,
    loginWithScanQrcode,
    updateUserProfile,
    mergeAuthUser,
    clearAuth,
  }
}
