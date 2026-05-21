<template>
  <main class="auth-page">
    <div class="auth-layout">
      <AuthBrandPanel :login-data="loginContent" />

      <NuxtLink :to="localePath('/')" class="auth-mobile-logo">
        <img src="/images/logo.png" alt="" aria-hidden="true">
        <span>Vicast<span>Cam</span></span>
      </NuxtLink>

      <section class="auth-card" aria-labelledby="auth-form-title">
        <button type="button" class="auth-card-corner" :aria-label="cornerLabel" @click="toggleLoginView">
          <img :src="cornerIcon" alt="" aria-hidden="true">
        </button>

        <div class="auth-card-heading">
          <img :src="headingIcon" alt="" aria-hidden="true">
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
        <AuthScanPanel v-else :login-box="loginBoxCopy" :toast-box="toastBoxCopy" />
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

setupPageSeo('login')

const localePath = useLocalePath()
const { locale } = useI18n()
const loginView = ref('account')
const loginMethod = ref('code')
const agreementAccepted = ref(true)
const loginContent = ref({})
const { setToastText } = useSiteToast()
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
})

const authCardTitle = computed(() => {
  if (loginView.value === 'scan') {
    return loginBoxCopy.qrLoginTab
  }

  return loginBoxCopy.loginPageTitle
})
const headingIcon = computed(() => loginView.value === 'scan' ? '/images/scanCode.png' : '/images/Email.png')
const cornerIcon = computed(() => loginView.value === 'scan' ? '/images/Lock.png' : '/images/QR.png')
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

  loginBoxCopy.loginPageTitle = loginBox.loginPageTitle || ''
  loginBoxCopy.codeLoginTab = loginBox.codeLoginTab || ''
  loginBoxCopy.pwdLoginTab = loginBox.pwdLoginTab || ''
  loginBoxCopy.qrLoginTab = loginBox.qrLoginTab || ''
  loginBoxCopy.emailInputPlaceholder = loginBox.emailInputPlaceholder || ''
  loginBoxCopy.pwdInputPlaceholder = loginBox.pwdInputPlaceholder || loginBox.passwordInputPlaceholder || ''
  loginBoxCopy.verifyCodePlaceholder = loginBox.verifyCodePlaceholder || ''
  loginBoxCopy.getVerifyCodeText = loginBox.getVerifyCodeText || ''
  loginBoxCopy.loginBtnText = loginBox.loginBtnText || ''
  loginBoxCopy.qrLoginTip = loginBox.qrLoginTip || ''
  loginBoxCopy.qrWaitingTip = loginBox.qrWaitingTip || ''
  loginBoxCopy.qrRetryText = loginBox.qrRetryText || ''
  loginBoxCopy.qrEmptyText = loginBox.qrEmptyText || ''
  loginBoxCopy.qrCodeAlt = loginBox.qrCodeAlt || ''
  loginBoxCopy.agreeProtocolText = loginBox.agreeProtocolText || ''
  loginBoxCopy.agreeProtocolPrefix = loginBox.agreeProtocolPrefix || ''
  loginBoxCopy.agreementConnector = loginBox.agreementConnector || ''
  loginBoxCopy.userProtocolText = loginBox.userProtocolText || ''
  loginBoxCopy.privacyPolicyText = loginBox.privacyPolicyText || ''
  loginBoxCopy.showPasswordLabel = loginBox.showPasswordLabel || ''
  loginBoxCopy.hidePasswordLabel = loginBox.hidePasswordLabel || ''
}

const syncToastBoxCopy = (loginData = {}) => {
  const toastBox = getToastBoxData(loginData)

  toastBoxCopy.closeToastLabel = toastBox.closeToastLabel || ''
  toastBoxCopy.requestLoading = toastBox.requestLoading || ''
  toastBoxCopy.requestSuccess = toastBox.requestSuccess || ''
  toastBoxCopy.requestFail = toastBox.requestFail || ''
  toastBoxCopy.passwordLoginNotReady = toastBox.passwordLoginNotReady || ''
  toastBoxCopy.passwordRequired = toastBox.passwordRequired || ''
  toastBoxCopy.emailRequired = toastBox.emailRequired || ''
  toastBoxCopy.verifyCodeRequired = toastBox.verifyCodeRequired || ''
  toastBoxCopy.agreeProtocolRequired = toastBox.agreeProtocolRequired || ''
  toastBoxCopy.qrcodeExpired = toastBox.qrcodeExpired || ''
  setToastText(toastBoxCopy)
}

const syncLoginContent = (loginData = {}) => {
  loginContent.value = loginData
  syncLoginBoxCopy(loginData)
  syncToastBoxCopy(loginData)
}

// 登录页所有语言文案统一从 Strapi 读取，左侧文案和右侧登录框共用这一份数据。
const loadLoginContent = () => {
  getLogin(locale.value).then(
    response => {
      syncLoginContent(getLoginContentData(response))
    },
    () => {
      syncLoginContent()
    }
  )
}

onMounted(() => {
  loadLoginContent()
})

watch(locale, () => {
  loadLoginContent()
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
  color: rgba(255, 255, 255, 1);
  background:
    linear-gradient(90deg, rgba(3, 7, 18, 0.08) 0%, rgba(3, 7, 18, 0.12) 45%, rgba(3, 7, 18, 0.28) 100%),
    url("/images/loginbg.png") center / cover no-repeat,
    var(--page-route-background);
}

.auth-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(3, 7, 18, 0) 0%, rgba(3, 7, 18, 0.1) 48%, rgba(3, 7, 18, 0.42) 100%);
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
  color: rgba(255, 255, 255, 1);
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

.auth-mobile-logo > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auth-mobile-logo span span {
  color: rgba(20, 198, 239, 1);
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
  border: 1px solid rgba(38, 48, 68, 1);
  border-radius: 14px;
  background-color: rgba(17, 24, 39, 1);
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
    url("/images/qrbg.png") center / 100% 100% no-repeat,
    rgba(17, 24, 39, 1);
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
  border-bottom: 3px solid rgba(34, 211, 238, 1);
  color: rgba(34, 211, 238, 1);
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
