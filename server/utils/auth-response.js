import { setCookie } from 'h3'
import { isPlainObject } from './vicast-api'

const AUTH_TOKEN_COOKIE = 'vicast_auth_token'
const AUTH_USER_COOKIE = 'vicast_auth_user'

export const findAuthToken = (response) => {
  return response?.token ||
    response?.accessToken ||
    response?.access_token ||
    response?.data?.token ||
    response?.data?.accessToken ||
    response?.data?.access_token ||
    ''
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

export const createPublicAuthUser = (response) => {
  const user = response?.user ||
    response?.userinfo ||
    response?.user_info ||
    response?.userInfo ||
    response?.data?.user ||
    response?.data?.userinfo ||
    response?.data?.user_info ||
    response?.data?.userInfo ||
    response?.data ||
    null

  if (!isPlainObject(user)) {
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

export const removeTokenFields = (value) => {
  if (!isPlainObject(value)) {
    return value
  }

  const publicValue = { ...value }

  delete publicValue.token
  delete publicValue.accessToken
  delete publicValue.access_token

  return publicValue
}

export const createPublicLoginResponse = (response) => {
  if (!isPlainObject(response)) {
    return response
  }

  return {
    ...removeTokenFields(response),
    data: removeTokenFields(response.data),
  }
}

// 登录成功时统一写 cookie：token 只放 HttpOnly cookie，前端只能读公开用户信息。
export const writeAuthCookies = (event, response) => {
  const token = findAuthToken(response)

  if (token) {
    setCookie(event, AUTH_TOKEN_COOKIE, String(token), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  const authUser = createPublicAuthUser(response)
  if (authUser?.user_id) {
    setCookie(event, AUTH_USER_COOKIE, JSON.stringify(authUser), {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  return authUser
}

export const createAuthLoginResult = (event, response) => {
  writeAuthCookies(event, response)

  return createPublicLoginResponse(response)
}
