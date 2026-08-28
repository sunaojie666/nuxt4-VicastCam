import { createRequest } from './index'

// 登录相关接口统一走 Nuxt server/api，避免前端直接绑定真实业务接口域名。
const authRequest = createRequest({
  baseURL: '/api/auth',
  responseScope: 'auth',
})

const authResponseOptions = {
  responseScope: 'auth',
  skipAuthExpiredRedirect: true,
}

// 发送邮箱验证码。后端真实接口是 https://api.vicastcam.com/v1/SendEmail。
export const sendEmailCode = (email, type = 'register') => {
  return authRequest.post('/send-email', {
    email: String(email || '').trim(),
    type: String(type || 'register').trim(),
  }, authResponseOptions)
}

// 邮箱验证码登录。服务端会转发到 https://api.vicastcam.com/v1/LoginByEmail。
export const loginByEmailCode = ({ email, captcha } = {}) => {
  return authRequest.post('/login-by-email', {
    email: String(email || '').trim(),
    captcha: String(captcha || '').trim(),
  }, authResponseOptions)
}

// 校验邮箱验证码。服务端会转发到 https://api.vicastcam.com/v1/ValidCaptcha。
export const validCaptcha = ({ user_id, captcha, type = 'cancel' } = {}) => {
  return authRequest.post('/valid-captcha', {
    user_id: String(user_id || '').trim(),
    captcha: String(captcha || '').trim(),
    type: String(type || 'cancel').trim(),
  }, {
    ...authResponseOptions,
    skipBusinessCodeValidation: true,
  })
}

// 绑定邮箱。服务端会转发到 https://api.vicastcam.com/v1/BindEmail。
export const bindEmail = ({ user_id, email, captcha } = {}) => {
  return authRequest.post('/bind-email', {
    user_id: String(user_id || '').trim(),
    email: String(email || '').trim(),
    captcha: String(captcha || '').trim(),
  }, authResponseOptions)
}

// 账号密码登录。服务端会转发到 https://api.vicastcam.com/v1/LoginByPassword。
export const loginByPassword = ({ account, password } = {}) => {
  return authRequest.post('/login-by-password', {
    account: String(account || '').trim(),
    password: String(password || ''),
  }, authResponseOptions)
}

// 获取扫码登录二维码。服务端会转发到 https://api.vicastcam.com/v1/GetQrcode。
export const getLoginQrcode = () => {
  return authRequest.post('/get-qrcode', {}, {
    ...authResponseOptions,
    responseScope: 'qr',
  })
}

// 检查扫码登录状态。服务端会转发到 https://api.vicastcam.com/v1/CheckStatus。
export const checkScanLoginStatus = (uuid) => {
  return authRequest.post('/check-status', {
    uuid: String(uuid || '').trim(),
  }, {
    skipAuthExpiredRedirect: true,
    skipGlobalLoading: true,
    responseScope: 'qr',
  })
}

// 获取团队成员列表。服务端会转发到 https://api.vicastcam.com/v1/GetTeamList。
export const getTeamList = (payload = {}) => {
  return authRequest.post('/get-team-list', {
    user_id: String(payload.user_id || '').trim(),
    level: String(payload.level || '1'),
    month: String(payload.month || '').trim(),
    page_index: Number(payload.page_index) || 1,
    page_size: Number(payload.page_size) || 10,
  })
}

// 获取团队信息。服务端会转发到 https://api.vicastcam.com/v1/GetTeamInfo。
export const getTeamInfo = (payload = {}) => {
  return authRequest.post('/get-team-info', {
    user_id: String(payload.user_id || '').trim(),
  })
}

// 获取购买记录。服务端会转发到 https://api.vicastcam.com/v1/GetBuyRecords。
export const getBuyRecords = (payload = {}) => {
  return authRequest.post('/get-buy-records', {
    user_id: String(payload.user_id || '').trim(),
    page: Number(payload.page) || 1,
    limit: Number(payload.limit) || 10,
  })
}

// Server proxy for https://api.vicastcam.com/v1/GetActivatedCardList.
export const getActivatedCardList = (payload = {}) => {
  return authRequest.post('/get-activated-card-list', {
    user_id: String(payload.user_id || '').trim(),
    page: Number(payload.page) || 1,
    limit: Number(payload.limit) || 10,
  })
}

// 获取佣金明细。服务端会转发到 https://api.vicastcam.com/v1/GetCommissionList。
export const getCommissionList = (payload = {}) => {
  return authRequest.post('/get-commission-list', {
    user_id: String(payload.user_id || '').trim(),
    month: String(payload.month || '').trim(),
    page_index: Number(payload.page_index) || 1,
    page_size: Number(payload.page_size) || 10,
  })
}

// 获取 VIP 类型。服务端会转发到 https://api.vicastcam.com/v1/GetVipTypes。
export const getVipTypes = () => {
  return authRequest.post('/get-vip-types', {}, {
    skipAuthExpiredRedirect: true,
    responseScope: 'general',
  })
}

// 激活兑换卡。服务端会转发到 https://api.vicastcam.com/v1/ActiveCard。
export const activeCard = (payload = {}) => {
  return authRequest.post('/active-card', {
    user_id: String(payload.user_id || '').trim(),
    card_pwd: String(payload.card_pwd || '').trim(),
  }, {
    responseScope: 'card',
  })
}

// 获取会员状态信息。服务端会转发到 https://api.vicastcam.com/v1/GetVipInfo。
export const getVipInfo = (payload = {}) => {
  return authRequest.post('/get-vip-info', {
    user_id: String(payload.user_id || '').trim(),
  })
}

// 退出登录。服务端会携带登录 token 转发到 https://api.vicastcam.com/v1/Logout。
export const logout = (payload = {}) => {
  return authRequest.post('/logout', {
    user_id: String(payload.user_id || '').trim(),
  }, authResponseOptions)
}

// 账号注销。服务端会携带登录 token 转发到 https://api.vicastcam.com/v1/AccountCancel。
export const cancelAccount = (payload = {}) => {
  return authRequest.post('/account-cancel', {
    user_id: String(payload.user_id || '').trim(),
  }, {
    ...authResponseOptions,
    responseScope: 'account',
    skipBusinessCodeValidation: true,
  })
}

// 撤销账号注销。服务端会携带登录 token 转发到 https://api.vicastcam.com/v1/RevokeCancel。
export const revokeCancel = (payload = {}) => {
  return authRequest.post('/revoke-cancel', {
    user_id: String(payload.user_id || '').trim(),
  }, {
    ...authResponseOptions,
    responseScope: 'account',
  })
}
