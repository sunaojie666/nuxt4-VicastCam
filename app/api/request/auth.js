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

// 获取购买记录。服务端会转发到 https://api.vicastcam.com/v1/GetBuyRecords。
export const getBuyRecords = (payload = {}) => {
  return authRequest.post('/get-buy-records', {
    user_id: String(payload.user_id || '').trim(),
    page: Number(payload.page) || 1,
    limit: Number(payload.limit) || 5,
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
  })
}

// 激活兑换卡。服务端会转发到 https://api.vicastcam.com/v1/ActiveCard。
export const activeCard = (payload = {}) => {
  return authRequest.post('/active-card', {
    user_id: String(payload.user_id || '').trim(),
    card_pwd: String(payload.card_pwd || '').trim(),
  })
}

// 获取会员状态信息。服务端会转发到 https://api.vicastcam.com/v1/GetVipInfo。
export const getVipInfo = (payload = {}) => {
  return authRequest.post('/get-vip-info', {
    user_id: String(payload.user_id || '').trim(),
  })
}
