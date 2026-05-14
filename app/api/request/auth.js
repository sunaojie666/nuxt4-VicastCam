import { createRequest } from './index'

// 登录相关接口统一走 Nuxt server/api，避免前端直接绑定真实业务接口域名。
const authRequest = createRequest({
  baseURL: '/api/auth',
})

// 发送邮箱验证码。后端真实接口是 https://api.vicastcam.com/v1/SendEmail。
export const sendEmailCode = (email) => {
  return authRequest.post('/send-email', {
    email: String(email || '').trim(),
  }, {
    skipAuthExpiredRedirect: true,
  })
}

// 邮箱验证码登录。服务端会转发到 https://api.vicastcam.com/v1/LoginByEmail。
export const loginByEmailCode = ({ email, captcha } = {}) => {
  return authRequest.post('/login-by-email', {
    email: String(email || '').trim(),
    captcha: String(captcha || '').trim(),
  }, {
    skipAuthExpiredRedirect: true,
  })
}

// 账号密码登录。服务端会转发到 https://api.vicastcam.com/v1/LoginByPassword。
export const loginByPassword = ({ account, password } = {}) => {
  return authRequest.post('/login-by-password', {
    account: String(account || '').trim(),
    password: String(password || ''),
  }, {
    skipAuthExpiredRedirect: true,
  })
}

// 获取扫码登录二维码。服务端会转发到 https://api.vicastcam.com/v1/GetQrcode。
export const getLoginQrcode = () => {
  return authRequest.post('/get-qrcode', {}, {
    skipAuthExpiredRedirect: true,
  })
}

// 检查扫码登录状态。服务端会转发到 https://api.vicastcam.com/v1/CheckStatus。
export const checkScanLoginStatus = (uuid) => {
  return authRequest.post('/check-status', {
    uuid: String(uuid || '').trim(),
  }, {
    skipAuthExpiredRedirect: true,
    skipGlobalLoading: true,
  })
}

const appendUpdateUserValue = (formData, key, value) => {
  if (value === undefined || value === null) {
    return
  }

  if (key === 'password' && !String(value || '').trim()) {
    return
  }

  if (key === 'avatar') {
    if (value instanceof File) {
      formData.append(key, value)
    }
    return
  }

  formData.append(key, String(value))
}

// 修改用户资料。服务端会转发到 https://api.vicastcam.com/v1/UpdateUser。
export const updateUserProfile = (payload = {}) => {
  const formData = new FormData()

  appendUpdateUserValue(formData, 'user_id', payload.user_id)
  appendUpdateUserValue(formData, 'nickname', payload.nickname)
  appendUpdateUserValue(formData, 'intro', payload.intro)
  appendUpdateUserValue(formData, 'industry', payload.industry)
  appendUpdateUserValue(formData, 'gender', payload.gender)
  appendUpdateUserValue(formData, 'area', payload.area)
  appendUpdateUserValue(formData, 'password', payload.password)
  appendUpdateUserValue(formData, 'avatar', payload.avatar)
  appendUpdateUserValue(formData, 'mobile', payload.mobile)
  appendUpdateUserValue(formData, 'email', payload.email)

  return authRequest.post('/update-user', formData)
}
