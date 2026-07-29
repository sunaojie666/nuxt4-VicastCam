<template>
  <main class="auth-page">
    <div class="auth-layout">
      <AuthBrandPanel :login-data="loginContent" />

      <NuxtLink :to="localePath('/')" class="auth-mobile-logo">
        <img :src="mediaUrl('/images/common/logo.png')" alt="" aria-hidden="true" role="presentation">
        <span>Vicast<span>Cam</span></span>
      </NuxtLink>

      <section class="auth-card" aria-labelledby="auth-form-title">
        <button type="button" class="auth-card-corner" :aria-label="cornerLabel" @click="toggleLoginView">
          <img :src="cornerIcon" alt="" aria-hidden="true" role="presentation">
        </button>

        <div class="auth-card-heading">
          <img :src="headingIcon" alt="" aria-hidden="true" role="presentation">
          <h2 id="auth-form-title">{{ authCardTitle }}</h2>
        </div>

        <AuthAccountForm
          v-if="loginView === 'account'"
          v-model:agreement-accepted="agreementAccepted"
          :login-box="loginBoxCopy"
          :login-method="loginMethod"
          :toast-box="toastBoxCopy"
          @toggle-login-method="toggleLoginMethod"
        />
        <AuthScanPanel
          v-else
          :login-box="loginBoxCopy"
          :toast-box="toastBoxCopy"
        />
      </section>
    </div>
  </main>
</template>

<script setup>
import AuthAccountForm from './components/AuthAccountForm.vue'
import AuthBrandPanel from './components/AuthBrandPanel.vue'
import AuthScanPanel from './components/AuthScanPanel.vue'
import { getLogin } from '../../api/request/strapi'
import { setupPageSeo } from '../../utils/seo'
const mediaUrl = useMediaUrl()

setupPageSeo('login')

const localePath = useLocalePath()
const { locale } = useI18n()
const loginView = ref('account')
const loginMethod = ref('code')
const agreementAccepted = ref(true)
const loginContent = useState('login-page-content', () => ({}))
const loginContentLocale = useState('login-page-content-locale', () => '')
const { setToastText } = useSiteToast()
const defaultLoginCopyMap = {
  'zh-CN': {
    loginPageTitle: '账号登录',
    codeLoginTab: '验证码登录',
    pwdLoginTab: '密码登录',
    qrLoginTab: '扫码登录',
    emailInputPlaceholder: '请输入邮箱',
    pwdInputPlaceholder: '请输入密码',
    verifyCodePlaceholder: '请输入验证码',
    getVerifyCodeText: '获取验证码',
    loginBtnText: '登录',
    qrLoginTip: '请使用 VicastCam App 扫码登录',
    qrWaitingTip: '等待扫码确认',
    qrRetryText: '重新获取二维码',
    qrEmptyText: '二维码暂不可用',
    qrCodeAlt: '登录二维码',
    agreeProtocolPrefix: '我已阅读并同意',
    agreementConnector: '和',
    userProtocolText: '用户协议',
    privacyPolicyText: '隐私政策',
    showPasswordLabel: '显示密码',
    hidePasswordLabel: '隐藏密码',
  },
  'zh-TW': {
    loginPageTitle: '帳號登入',
    codeLoginTab: '驗證碼登入',
    pwdLoginTab: '密碼登入',
    qrLoginTab: '掃碼登入',
    emailInputPlaceholder: '請輸入郵箱',
    pwdInputPlaceholder: '請輸入密碼',
    verifyCodePlaceholder: '請輸入驗證碼',
    getVerifyCodeText: '獲取驗證碼',
    loginBtnText: '登入',
    qrLoginTip: '請使用 VicastCam App 掃碼登入',
    qrWaitingTip: '等待掃碼確認',
    qrRetryText: '重新獲取二維碼',
    qrEmptyText: '二維碼暫不可用',
    qrCodeAlt: '登入二維碼',
    agreeProtocolPrefix: '我已閱讀並同意',
    agreementConnector: '和',
    userProtocolText: '使用者協議',
    privacyPolicyText: '隱私政策',
    showPasswordLabel: '顯示密碼',
    hidePasswordLabel: '隱藏密碼',
  },
  en: {
    loginPageTitle: 'Account Login',
    codeLoginTab: 'Code Login',
    pwdLoginTab: 'Password Login',
    qrLoginTab: 'QR Login',
    emailInputPlaceholder: 'Enter email',
    pwdInputPlaceholder: 'Enter password',
    verifyCodePlaceholder: 'Enter verification code',
    getVerifyCodeText: 'Get Code',
    loginBtnText: 'Log In',
    qrLoginTip: 'Scan with the VicastCam app',
    qrWaitingTip: 'Waiting for confirmation',
    qrRetryText: 'Refresh QR code',
    qrEmptyText: 'QR code unavailable',
    qrCodeAlt: 'Login QR code',
    agreeProtocolPrefix: 'I have read and agree to',
    agreementConnector: 'and',
    userProtocolText: 'User Agreement',
    privacyPolicyText: 'Privacy Policy',
    showPasswordLabel: 'Show password',
    hidePasswordLabel: 'Hide password',
  },
}
const defaultToastCopyMap = {
  'zh-CN': {
    closeToastLabel: '关闭提示',
    requestLoading: '处理中',
    requestSuccess: '操作成功',
    requestFail: '操作失败，请稍后重试',
    passwordRequired: '请输入密码',
    emailRequired: '请输入有效邮箱',
    verifyCodeRequired: '请输入验证码',
    agreeProtocolRequired: '请先同意服务条款和隐私政策',
    qrcodeExpired: '二维码已失效，请重新获取',
  },
  'zh-TW': {
    closeToastLabel: '關閉提示',
    requestLoading: '處理中',
    requestSuccess: '操作成功',
    requestFail: '操作失敗，請稍後重試',
    passwordRequired: '請輸入密碼',
    emailRequired: '請輸入有效郵箱',
    verifyCodeRequired: '請輸入驗證碼',
    agreeProtocolRequired: '請先同意服務條款和隱私政策',
    qrcodeExpired: '二維碼已失效，請重新獲取',
  },
  en: {
    closeToastLabel: 'Close message',
    requestLoading: 'Processing',
    requestSuccess: 'Done',
    requestFail: 'Request failed. Please try again',
    passwordRequired: 'Enter your password',
    emailRequired: 'Enter a valid email',
    verifyCodeRequired: 'Enter the verification code',
    agreeProtocolRequired: 'Please accept the terms and privacy policy first',
    qrcodeExpired: 'QR code expired. Please refresh it',
  },
}

const getDefaultLoginCopy = () => defaultLoginCopyMap[locale.value] || defaultLoginCopyMap.en
const getDefaultToastCopy = () => defaultToastCopyMap[locale.value] || defaultToastCopyMap.en
const getCopyValue = (source, fallback, key, ...aliases) => {
  for (const field of [key, ...aliases]) {
    const value = source?.[field]

    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }

  return fallback[key] || ''
}
const loginBoxCopy = reactive({
  loginPageTitle: '',
  codeLoginTab: '',
  pwdLoginTab: '',
  qrLoginTab: '',
  emailInputPlaceholder: '',
  pwdInputPlaceholder: '',
  verifyCodePlaceholder: '',
  getVerifyCodeText: '',
  loginBtnText: '',
  qrLoginTip: '',
  qrWaitingTip: '',
  qrRetryText: '',
  qrEmptyText: '',
  qrCodeAlt: '',
  agreeProtocolText: '',
  agreeProtocolPrefix: '',
  agreementConnector: '',
  userProtocolText: '',
  privacyPolicyText: '',
  showPasswordLabel: '',
  hidePasswordLabel: '',
})
const toastBoxCopy = reactive({
  closeToastLabel: '',
  requestLoading: '',
  requestSuccess: '',
  requestFail: '',
  passwordLoginNotReady: '',
  passwordRequired: '',
  emailRequired: '',
  verifyCodeRequired: '',
  agreeProtocolRequired: '',
  qrcodeExpired: '',
  apiResponseMessages: {},
})

const authCardTitle = computed(() => {
  if (loginView.value === 'scan') {
    return loginBoxCopy.qrLoginTab
  }

  return loginBoxCopy.loginPageTitle
})
const headingIcon = computed(() => loginView.value === 'scan' ? mediaUrl('/images/login/scan-code-icon.png') : mediaUrl('/images/login/email-icon.png'))
const cornerIcon = computed(() => loginView.value === 'scan' ? mediaUrl('/images/login/lock-icon.png') : mediaUrl('/images/login/qr-toggle-icon.png'))
const cornerLabel = computed(() => {
  return loginView.value === 'scan' ? loginBoxCopy.loginPageTitle : loginBoxCopy.qrLoginTab
})

const toggleLoginMethod = () => {
  loginMethod.value = loginMethod.value === 'code' ? 'password' : 'code'
}

const toggleLoginView = () => {
  loginView.value = loginView.value === 'account' ? 'scan' : 'account'
}

const parseStrapiJsonField = (value) => {
  if (typeof value !== 'string') {
    return value
  }

  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

const normalizeStrapiRecord = (record) => {
  if (!record || typeof record !== 'object') {
    return {}
  }

  const recordData = record.logins || record.attributes?.logins || record

  return {
    ...recordData,
    ...(recordData.attributes || {}),
  }
}

const getLoginContentData = (response) => {
  return normalizeStrapiRecord(response?.data?.[0] || response?.data || {})
}

const getLoginBoxData = (loginData = {}) => {
  const loginBox = parseStrapiJsonField(loginData.loginBox)

  if (Array.isArray(loginBox)) {
    return normalizeStrapiRecord(loginBox[0])
  }

  return normalizeStrapiRecord(loginBox)
}

const getToastBoxData = (loginData = {}) => {
  const toastBox = parseStrapiJsonField(loginData.toastBox)

  if (Array.isArray(toastBox)) {
    return normalizeStrapiRecord(toastBox[0])
  }

  return normalizeStrapiRecord(toastBox)
}

const syncLoginBoxCopy = (loginData = {}) => {
  const loginBox = getLoginBoxData(loginData)
  const fallback = getDefaultLoginCopy()

  loginBoxCopy.loginPageTitle = getCopyValue(loginBox, fallback, 'loginPageTitle')
  loginBoxCopy.codeLoginTab = getCopyValue(loginBox, fallback, 'codeLoginTab')
  loginBoxCopy.pwdLoginTab = getCopyValue(loginBox, fallback, 'pwdLoginTab')
  loginBoxCopy.qrLoginTab = getCopyValue(loginBox, fallback, 'qrLoginTab')
  loginBoxCopy.emailInputPlaceholder = getCopyValue(loginBox, fallback, 'emailInputPlaceholder')
  loginBoxCopy.pwdInputPlaceholder = getCopyValue(loginBox, fallback, 'pwdInputPlaceholder', 'passwordInputPlaceholder')
  loginBoxCopy.verifyCodePlaceholder = getCopyValue(loginBox, fallback, 'verifyCodePlaceholder')
  loginBoxCopy.getVerifyCodeText = getCopyValue(loginBox, fallback, 'getVerifyCodeText')
  loginBoxCopy.loginBtnText = getCopyValue(loginBox, fallback, 'loginBtnText')
  loginBoxCopy.qrLoginTip = getCopyValue(loginBox, fallback, 'qrLoginTip')
  loginBoxCopy.qrWaitingTip = getCopyValue(loginBox, fallback, 'qrWaitingTip')
  loginBoxCopy.qrRetryText = getCopyValue(loginBox, fallback, 'qrRetryText')
  loginBoxCopy.qrEmptyText = getCopyValue(loginBox, fallback, 'qrEmptyText')
  loginBoxCopy.qrCodeAlt = getCopyValue(loginBox, fallback, 'qrCodeAlt')
  loginBoxCopy.agreeProtocolText = getCopyValue(loginBox, fallback, 'agreeProtocolText')
  loginBoxCopy.agreeProtocolPrefix = getCopyValue(loginBox, fallback, 'agreeProtocolPrefix')
  loginBoxCopy.agreementConnector = getCopyValue(loginBox, fallback, 'agreementConnector')
  loginBoxCopy.userProtocolText = getCopyValue(loginBox, fallback, 'userProtocolText')
  loginBoxCopy.privacyPolicyText = getCopyValue(loginBox, fallback, 'privacyPolicyText')
  loginBoxCopy.showPasswordLabel = getCopyValue(loginBox, fallback, 'showPasswordLabel')
  loginBoxCopy.hidePasswordLabel = getCopyValue(loginBox, fallback, 'hidePasswordLabel')
}

const syncToastBoxCopy = (loginData = {}) => {
  const toastBox = getToastBoxData(loginData)
  const fallback = getDefaultToastCopy()

  toastBoxCopy.closeToastLabel = getCopyValue(toastBox, fallback, 'closeToastLabel')
  toastBoxCopy.requestLoading = getCopyValue(toastBox, fallback, 'requestLoading')
  toastBoxCopy.requestSuccess = getCopyValue(toastBox, fallback, 'requestSuccess')
  toastBoxCopy.requestFail = getCopyValue(toastBox, fallback, 'requestFail')
  toastBoxCopy.passwordLoginNotReady = getCopyValue(toastBox, fallback, 'passwordLoginNotReady')
  toastBoxCopy.passwordRequired = getCopyValue(toastBox, fallback, 'passwordRequired')
  toastBoxCopy.emailRequired = getCopyValue(toastBox, fallback, 'emailRequired')
  toastBoxCopy.verifyCodeRequired = getCopyValue(toastBox, fallback, 'verifyCodeRequired')
  toastBoxCopy.agreeProtocolRequired = getCopyValue(toastBox, fallback, 'agreeProtocolRequired')
  toastBoxCopy.qrcodeExpired = getCopyValue(toastBox, fallback, 'qrcodeExpired')
  toastBoxCopy.apiResponseMessages = parseStrapiJsonField(
    toastBox.apiResponseMessages || toastBox.responseMessages || toastBox.responseCodes
  ) || {}
  setToastText(toastBoxCopy)
}

const syncLoginContent = (loginData = {}) => {
  loginContent.value = loginData
  syncLoginBoxCopy(loginData)
  syncToastBoxCopy(loginData)
}

syncLoginContent(loginContent.value)

// 登录页所有语言文案统一从 Strapi 读取，左侧文案和右侧登录框共用这一份数据。
useLocalizedAsyncState({
  locale,
  loadedLocale: loginContentLocale,
  load: currentLocale => getLogin(currentLocale),
  sync: response => {
    syncLoginContent(getLoginContentData(response))
  },
  reset: () => {
    syncLoginContent()
  },
})

</script>

<style>
.auth-page {
  position: relative;
  min-height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 10.68vw 32px 10.73vw;
  color: var(--theme-white);
  background:
    linear-gradient(90deg, var(--theme-page-08) 0%, var(--theme-page-12) 45%, var(--theme-page-28) 100%),
    var(--media-images-login-background-png) center / cover no-repeat,
    var(--page-route-background);
}

.auth-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--theme-page-00) 0%, var(--theme-page-10) 48%, var(--theme-page-42) 100%);
  pointer-events: none;
}

.auth-layout {
  width: min(100%, var(--page-max-width));
  display: grid;
  grid-template-columns: minmax(260px, 1fr) 476px;
  align-items: start;
  gap: clamp(24px, 2.5vw, 48px);
  margin: 0 auto;
  min-width: 0;
}

.auth-mobile-logo {
  display: none;
  align-items: center;
  justify-self: center;
  gap: 10px;
  max-width: 100%;
  color: var(--theme-white);
  font-size: 24px;
  font-weight: 900;
  line-height: 32px;
}

.auth-mobile-logo img {
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border-radius: 4px;
}

:root[data-theme="dark"] .auth-mobile-logo img {
  border-radius: 8px;
}

.auth-mobile-logo > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auth-mobile-logo span span {
  color: var(--theme-accent-brand);
}

.auth-card {
  --auth-corner-size: 67px;
  position: relative;
  z-index: 1;
  width: 476px;
  min-height: 621px;
  overflow-x: hidden;
  overflow-y: visible;
  justify-self: end;
  padding: 41px 39px 28px;
  border: 1px solid var(--theme-extra-38-48-68-1);
  border-radius: 14px;
  background-color: var(--theme-surface-alt);
}

.auth-card-corner {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  width: var(--auth-corner-size);
  height: var(--auth-corner-size);
  box-sizing: border-box;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 100%);
  background:
    var(--media-images-login-qr-panel-bg-png) center / 100% 100% no-repeat,
    var(--theme-surface-alt);
  cursor: pointer;
}

.auth-card-corner img {
  position: absolute;
  top: 11px;
  right: 10px;
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.auth-card-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  max-width: calc(100% - var(--auth-corner-size));
  padding-bottom: 18px;
  border-bottom: 3px solid var(--theme-accent);
  color: var(--theme-accent);
}

.auth-card-heading img {
  display: block;
  width: auto;
  height: auto;
  max-width: none;
  flex: 0 0 auto;
}

.auth-card-heading h2 {
  min-width: 0;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  overflow-wrap: anywhere;
}

@media (max-width: 900px) {

  .auth-page {
    min-height: 100dvh;
    align-items: center;
    padding: 48px 20px;
  }

  .auth-layout {
    grid-template-columns: 1fr;
    gap: 18px;
    align-content: center;
    justify-items: center;
  }

  .auth-brand-panel {
    display: none;
  }

  .auth-mobile-logo {
    display: inline-flex;
  }

  .auth-card {
    width: min(100%, 476px);
    min-width: 0;
    min-height: 621px;
    justify-self: center;
    padding: 28px;
  }
}

@media (max-width: 1280px) and (min-width: 901px) {

  .auth-page {
    padding-left: 6vw;
    padding-right: 6vw;
  }

  .auth-layout {
    grid-template-columns: minmax(240px, 1fr) minmax(440px, 46vw);
  }

  .auth-card {
    width: min(46vw, 476px);
  }
}

@media (max-width: 520px) {

  .auth-page {
    padding: 32px 16px;
  }
  .auth-card {
    min-height: auto;
    padding: 22px;
  }
}
</style>
