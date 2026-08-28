<template>
  <form class="auth-form" @submit.prevent="handleLoginSubmit">
    <label class="auth-field" for="auth-account-email">
      <span class="auth-input-wrap">
        <Icon name="lucide:mail" aria-hidden="true" />
        <input
          id="auth-account-email"
          v-model.trim="emailAddress"
          name="email"
          :type="isPasswordLogin ? 'text' : 'email'"
          :inputmode="isPasswordLogin ? 'text' : 'email'"
          autocomplete="username"
          :aria-label="accountAriaLabel"
          :placeholder="accountPlaceholder"
        >
      </span>
    </label>

    <label class="auth-field" for="auth-login-credential">
      <span class="auth-input-wrap">
        <Icon name="lucide:lock-keyhole" aria-hidden="true" />
        <input
          id="auth-login-credential"
          v-model="loginCredential"
          :name="isPasswordLogin ? 'password' : 'verification_code'"
          :type="credentialInputType"
          :inputmode="isPasswordLogin ? undefined : 'numeric'"
          :autocomplete="isPasswordLogin ? 'current-password' : 'one-time-code'"
          :aria-label="credentialAriaLabel"
          :placeholder="credentialPlaceholder"
        >
        <button
          v-if="!isPasswordLogin"
          type="button"
          class="auth-code-button"
          :disabled="isSendingCode || puzzleVisible || codeCountdown > 0"
          @click="handleSendEmailCode"
        >
          {{ codeButtonText }}
        </button>
        <button
          v-else
          type="button"
          class="auth-password-visibility-button"
          :aria-label="passwordVisibilityLabel"
          @click="showPassword = !showPassword"
        >
          <Icon class="auth-input-trailing-icon" :name="showPassword ? 'lucide:eye' : 'lucide:eye-off'" aria-hidden="true" />
        </button>
      </span>
    </label>

    <button type="button" class="auth-password-button" @click="$emit('toggle-login-method')">
      {{ loginMethodToggleText }}
    </button>

    <button type="submit" class="auth-submit-button" :disabled="isLoggingIn || puzzleVisible">
      {{ submitButtonText }}
    </button>

    <label class="auth-agreement" for="auth-agreement-accepted">
      <input
        id="auth-agreement-accepted"
        v-model="agreementModel"
        name="agreement_accepted"
        type="checkbox"
        :aria-label="agreementAriaLabel"
      >
      <span class="auth-agreement-copy">
        <span v-if="loginBox.agreeProtocolPrefix">{{ loginBox.agreeProtocolPrefix }}</span>
        <NuxtLink
          v-if="loginBox.privacyPolicyText"
          :to="localePath('/privacy')"
          class="auth-agreement-action"
        >
          《{{ loginBox.privacyPolicyText }}》
        </NuxtLink>
        <span v-if="loginBox.privacyPolicyText && loginBox.userProtocolText && agreementConnector">{{ agreementConnector }}</span>
        <NuxtLink
          v-if="loginBox.userProtocolText"
          :to="localePath('/terms')"
          class="auth-agreement-action"
        >
          《{{ loginBox.userProtocolText }}》
        </NuxtLink>
      </span>
    </label>
  </form>

  <ClientOnly>
    <Vcode
      :show="puzzleVisible"
      class-name="auth-puzzle"
      :imgs="puzzleImages"
      :canvas-width="puzzleCanvasWidth"
      :canvas-height="puzzleCanvasHeight"
      :slider-size="48"
      :puzzle-scale="0.9"
      :range="8"
      :slider-text="puzzleText.slider"
      :success-text="puzzleText.success"
      :fail-text="puzzleText.failed"
      :interference-diagram-count="3"
      :z-index="9997"
      @success="handlePuzzleSuccess"
      @fail="handlePuzzleFail"
      @close="closePuzzle"
    />
  </ClientOnly>

  <Teleport to="body">
    <div
      v-if="showCoolingPeriodModal"
      class="cooling-period-backdrop"
    >
      <section
        class="cooling-period-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cooling-period-title"
      >
        <span class="cooling-period-icon">
          <Icon name="lucide:clock-3" aria-hidden="true" />
        </span>

        <h2 id="cooling-period-title">{{ copy.cooling.title }}</h2>

        <p class="cooling-period-description">
          {{ copy.cooling.description }}
        </p>

        <p v-if="coolingEndTimeText" class="cooling-period-endtime">
          {{ copy.cooling.endTimeLabel }}：<strong>{{ coolingEndTimeText }}</strong>
        </p>

        <div class="cooling-period-actions">
          <button
            type="button"
            class="cooling-period-primary"
            :disabled="isRevoking"
            @click="handleRevokeCancel"
          >
            {{ isRevoking ? copy.cooling.revoking : copy.cooling.revoke }}
          </button>
          <button
            type="button"
            class="cooling-period-secondary"
            @click="handleContinueCancellation"
          >
            {{ copy.cooling.continue }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { revokeCancel, sendEmailCode } from '../../../api/request/auth'
import Vcode from 'vue-sliding-puzzle'
import 'vue-sliding-puzzle/css'
import { useAccountDeletionCopy } from '../../../composables/useAccountDeletionCopy'
import { getLoginRedirectPath } from '../../../utils/auth-redirect'
import { clearAuthStorage } from '../../../utils/auth-session'
const mediaUrl = useMediaUrl()

const props = defineProps({
  loginMethod: {
    type: String,
    default: 'code',
  },
  loginBox: {
    type: Object,
    default: () => ({}),
  },
  toastBox: {
    type: Object,
    default: () => ({}),
  },
})
defineEmits(['toggle-login-method'])

const agreementModel = defineModel('agreementAccepted', {
  type: Boolean,
  required: true,
})
const { requestLoadingText, showApiResponseErrorToast, showApiResponseSuccessToast, showErrorToast } = useSiteToast()
const { loginWithEmailCode, loginWithPassword } = useAuth()
const { copy } = useAccountDeletionCopy()
const localePath = useLocalePath()
const { locale } = useI18n()

const emailAddress = ref('')
const loginCredential = ref('')
const isSendingCode = ref(false)
const isLoggingIn = ref(false)
const showCoolingPeriodModal = ref(false)
const coolingUserId = ref('')
const coolingEndTime = ref('')
const coolingLoginAccount = ref('')
const coolingLoginPassword = ref('')
const isRevoking = ref(false)
const showPassword = ref(false)
const puzzleVisible = ref(false)
const puzzleCanvasWidth = ref(310)
const codeCountdown = ref(0)
const codeLoginVerifiedEmail = ref('')
let codeCountdownTimer = null
let pendingPuzzleAction = null

const puzzleImages = [
  mediaUrl('/images/login/captcha-bg-1.png'),
  mediaUrl('/images/login/captcha-bg-2.png'),
  mediaUrl('/images/login/captcha-bg-3.png'),
  mediaUrl('/images/login/captcha-bg-4.png'),
]

const puzzleCopyMap = {
  'zh-CN': {
    slider: '拖动滑块完成拼图',
    success: '验证通过',
    failed: '验证失败，请重试',
  },
  'zh-TW': {
    slider: '拖動滑塊完成拼圖',
    success: '驗證通過',
    failed: '驗證失敗，請重試',
  },
  en: {
    slider: 'Drag the slider to complete the puzzle',
    success: 'Verified',
    failed: 'Verification failed. Please try again',
  },
}

const loginBox = computed(() => props.loginBox || {})
const toastBox = computed(() => props.toastBox || {})
const isPasswordLogin = computed(() => props.loginMethod === 'password')
const accountPlaceholder = computed(() => {
  return loginBox.value.emailInputPlaceholder
})
const credentialPlaceholder = computed(() => {
  return isPasswordLogin.value ? loginBox.value.pwdInputPlaceholder : loginBox.value.verifyCodePlaceholder
})
const accountAriaLabel = computed(() => accountPlaceholder.value || 'Email')
const credentialAriaLabel = computed(() => credentialPlaceholder.value || (isPasswordLogin.value ? 'Password' : 'Verification code'))
const agreementAriaLabel = computed(() => {
  return [
    loginBox.value.agreeProtocolPrefix,
    loginBox.value.privacyPolicyText,
    loginBox.value.userProtocolText,
  ].filter(Boolean).join(' ') || 'Accept privacy policy and user agreement'
})
const credentialInputType = computed(() => {
  if (!isPasswordLogin.value) {
    return 'text'
  }

  return showPassword.value ? 'text' : 'password'
})
const loginMethodToggleText = computed(() => {
  return isPasswordLogin.value ? loginBox.value.codeLoginTab : loginBox.value.pwdLoginTab
})
const codeButtonText = computed(() => {
  if (isSendingCode.value) {
    return requestLoadingText.value
  }

  if (codeCountdown.value > 0) {
    return `${codeCountdown.value}s`
  }

  return loginBox.value.getVerifyCodeText || ''
})
const submitButtonText = computed(() => {
  if (isLoggingIn.value) {
    return requestLoadingText.value
  }

  return loginBox.value.loginBtnText || ''
})
const agreementConnector = computed(() => loginBox.value.agreementConnector || '')
const passwordVisibilityLabel = computed(() => {
  return showPassword.value ? (loginBox.value.hidePasswordLabel || '') : (loginBox.value.showPasswordLabel || '')
})
const puzzleCanvasHeight = computed(() => Math.round(puzzleCanvasWidth.value * 0.52))
const puzzleLocaleCopy = computed(() => {
  return puzzleCopyMap[locale.value] || puzzleCopyMap.en
})
const puzzleText = computed(() => {
  return {
    slider: loginBox.value.slideVerifyText ||
      loginBox.value.puzzleSliderText ||
      loginBox.value.captchaSliderText ||
      loginBox.value.humanVerifyText ||
      puzzleLocaleCopy.value.slider,
    success: toastBox.value.slideVerifySuccess ||
      toastBox.value.puzzleVerifySuccess ||
      toastBox.value.humanVerifySuccess ||
      toastBox.value.captchaSuccess ||
      puzzleLocaleCopy.value.success,
    failed: toastBox.value.slideVerifyFailed ||
      toastBox.value.puzzleVerifyFailed ||
      toastBox.value.humanVerifyFailed ||
      toastBox.value.captchaFailed ||
      puzzleLocaleCopy.value.failed,
  }
})

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const getToastMessage = (key, fallback = '') => {
  return toastBox.value[key] || fallback
}

const normalizeEmailForVerification = email => String(email || '').trim().toLowerCase()

const markCodeLoginHumanVerified = (email) => {
  codeLoginVerifiedEmail.value = normalizeEmailForVerification(email)
}

const clearCodeLoginHumanVerified = () => {
  codeLoginVerifiedEmail.value = ''
}

const isCodeLoginHumanVerified = (email) => {
  return Boolean(codeLoginVerifiedEmail.value && codeLoginVerifiedEmail.value === normalizeEmailForVerification(email))
}

const validateEmail = () => {
  const email = emailAddress.value.trim()

  if (!email) {
    showErrorToast(getToastMessage('emailRequired', '请输入有效邮箱'))
    return ''
  }

  if (!isValidEmail(email)) {
    showErrorToast(getToastMessage('emailRequired', '请输入有效邮箱'))
    return ''
  }

  return email
}

const validateAccount = () => {
  const account = emailAddress.value.trim()

  if (!account) {
    showErrorToast(getToastMessage('emailRequired', '请输入账号或邮箱'))
    return ''
  }

  return account
}

const updatePuzzleSize = () => {
  if (!import.meta.client) {
    return
  }

  puzzleCanvasWidth.value = window.innerWidth <= 360 ? 280 : 310
}

const closePuzzle = () => {
  puzzleVisible.value = false
  pendingPuzzleAction = null
}

const openPuzzle = (action) => {
  pendingPuzzleAction = action
  puzzleVisible.value = true
}

const handlePuzzleSuccess = () => {
  const action = pendingPuzzleAction

  puzzleVisible.value = false
  pendingPuzzleAction = null

  if (typeof action === 'function') {
    nextTick(() => action())
  }
}

const handlePuzzleFail = () => {
  showErrorToast(puzzleText.value.failed)
}

// 邮箱验证码发送成功后开启倒计时，避免用户连续点击重复发送。
const startCodeCountdown = () => {
  codeCountdown.value = 60

  if (codeCountdownTimer) {
    window.clearInterval(codeCountdownTimer)
  }

  codeCountdownTimer = window.setInterval(() => {
    codeCountdown.value -= 1

    if (codeCountdown.value <= 0) {
      window.clearInterval(codeCountdownTimer)
      codeCountdownTimer = null
      codeCountdown.value = 0
    }
  }, 1000)
}

// 调用 Nuxt 代理接口发送邮箱验证码，接口代码保持 Promise 写法。
const handleSendEmailCode = () => {
  if (isSendingCode.value) {
    return
  }

  const email = validateEmail()

  if (!email) {
    return
  }

  if (isCodeLoginHumanVerified(email)) {
    sendEmailCodeAfterPuzzle(email)
    return
  }

  openPuzzle(() => {
    markCodeLoginHumanVerified(email)
    sendEmailCodeAfterPuzzle(email)
  })
}

const sendEmailCodeAfterPuzzle = (email) => {
  isSendingCode.value = true

  sendEmailCode(email, 'login').then(
    (response) => {
      isSendingCode.value = false
      showApiResponseSuccessToast(response, { scope: 'auth' })
      startCodeCountdown()
    },
    (error) => {
      isSendingCode.value = false
      showApiResponseErrorToast(error, {
        scope: 'auth',
        fallback: getToastMessage('requestFail', 'Request failed. Please try again'),
      })
    }
  )
}

// 邮箱验证码登录提交 email/captcha；密码登录提交 account/password。
const handleLoginSubmit = () => {
  if (isLoggingIn.value) {
    return
  }

  const account = isPasswordLogin.value ? validateAccount() : validateEmail()
  const credential = loginCredential.value.trim()
  const loginByPasswordMode = isPasswordLogin.value

  if (!account) {
    return
  }

  if (!credential) {
    showErrorToast(isPasswordLogin.value
      ? getToastMessage('passwordRequired', '请输入密码')
      : getToastMessage('verifyCodeRequired', '请输入验证码'))
    return
  }

  if (!agreementModel.value) {
    showErrorToast(getToastMessage('agreeProtocolRequired', '请先同意服务条款和隐私政策'))
    return
  }

  const loginPayload = {
    account,
    credential,
    isPassword: loginByPasswordMode,
  }

  if (!loginByPasswordMode && isCodeLoginHumanVerified(account)) {
    loginAfterPuzzle(loginPayload)
    return
  }

  openPuzzle(() => {
    if (!loginByPasswordMode) {
      markCodeLoginHumanVerified(account)
    }

    loginAfterPuzzle(loginPayload)
  })
}

const loginAfterPuzzle = ({ account, credential, isPassword }) => {
  isLoggingIn.value = true

  const loginRequest = isPassword
    ? loginWithPassword({ account, password: credential })
    : loginWithEmailCode({ email: account, captcha: credential })

  loginRequest.then(
    (response) => {
      isLoggingIn.value = false

      if (handleCoolingPeriodLogin(response, { account, credential, isPassword })) {
        return
      }

      showApiResponseSuccessToast(response, { scope: 'auth' })
      navigateTo(getLoginRedirectPath())
    },
    (error) => {
      isLoggingIn.value = false

      // 冷静期账号的登录响应可能不带 user 对象，导致上面的成功分支取不到用户；
      // 这里再从失败响应里检查 status=2，拦截并弹出冷静期提示。
      if (handleCoolingPeriodLogin(error?.data, { account, credential, isPassword })) {
        return
      }

      showApiResponseErrorToast(error, {
        scope: 'auth',
        fallback: getToastMessage('requestFail', 'Request failed. Please try again'),
      })
    }
  )
}

// 注销冷静期：密码登录返回 status=2 表示账号正处于注销冷静期。
const getLoginAccountStatus = (response) => {
  // 顶层 status 可能是 "success"/"error" 之类的通用状态字符串，
  // 真实的账号状态是数字（1 正常 / 2 冷静期），按数字优先提取。
  const candidates = [
    response?.data?.status,
    response?.user?.status,
    response?.data?.user?.status,
    response?.status,
  ]

  for (const value of candidates) {
    const numericStatus = Number(value)

    if (Number.isFinite(numericStatus)) {
      return numericStatus
    }
  }

  return 0
}

const handleCoolingPeriodLogin = (response, loginInfo = {}) => {
  if (getLoginAccountStatus(response) !== 2) {
    return false
  }

  coolingEndTime.value = String(
    response?.cancel_end_time ??
    response?.data?.cancel_end_time ??
    response?.user?.cancel_end_time ??
    response?.data?.user?.cancel_end_time ??
    response?.cancelEndTime ??
    response?.data?.cancelEndTime ??
    ''
  ).trim()

  coolingUserId.value = String(
    response?.user?.user_id ||
    response?.data?.user?.user_id ||
    response?.user?.id ||
    response?.data?.user?.id ||
    response?.user_id ||
    response?.data?.user_id ||
    response?.uid ||
    response?.data?.uid ||
    ''
  ).trim()

  if (loginInfo.isPassword) {
    coolingLoginAccount.value = String(loginInfo.account || '').trim()
    coolingLoginPassword.value = String(loginInfo.credential || '')
  }

  showCoolingPeriodModal.value = true

  return true
}

const formatCoolingEndTime = (value) => {
  if (!value) {
    return ''
  }

  let date
  const numericValue = Number(value)

  if (Number.isFinite(numericValue) && String(value).trim() !== '') {
    date = new Date(numericValue < 1e12 ? numericValue * 1000 : numericValue)
  } else {
    date = new Date(String(value))
  }

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  const pad = part => String(part).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const coolingEndTimeText = computed(() => formatCoolingEndTime(coolingEndTime.value))

const handleRevokeCancel = () => {
  if (isRevoking.value) {
    return
  }

  const userId = coolingUserId.value

  if (!userId) {
    showErrorToast(copy.value.toasts.userMissing)
    return
  }

  isRevoking.value = true

  // 服务端代理到 https://api.vicastcam.com/v1/RevokeCancel，成功后正常完成登录。
  revokeCancel({ user_id: userId }).then(
    (response) => {
      showApiResponseSuccessToast(response, { scope: 'account' })
      reLoginAfterRevoke()
    },
    (error) => {
      isRevoking.value = false
      showApiResponseErrorToast(error, {
        scope: 'account',
        fallback: copy.value.toasts.revokeFailed,
      })
    }
  )
}

// 撤销注销成功后，自动重新执行密码登录，正常进入系统。
const reLoginAfterRevoke = () => {
  const account = coolingLoginAccount.value
  const password = coolingLoginPassword.value

  if (!account || !password) {
    isRevoking.value = false
    showCoolingPeriodModal.value = false
    navigateTo(getLoginRedirectPath())
    return
  }

  isRevoking.value = true

  loginWithPassword({ account, password }).then(
    () => {
      isRevoking.value = false
      showCoolingPeriodModal.value = false
      navigateTo(getLoginRedirectPath())
    },
    (error) => {
      isRevoking.value = false
      showApiResponseErrorToast(error, {
        scope: 'auth',
        fallback: copy.value.toasts.loginFailed,
      })
    }
  )
}

const handleContinueCancellation = () => {
  showCoolingPeriodModal.value = false
  clearAuthStorage()
}

watch(showCoolingPeriodModal, (visible) => {
  if (!process.client) {
    return
  }

  document.body.style.overflow = visible ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (process.client && document.body.style.overflow === 'hidden') {
    document.body.style.overflow = ''
  }
})

watch([emailAddress, () => props.loginMethod], () => {
  if (puzzleVisible.value) {
    closePuzzle()
  } else {
    pendingPuzzleAction = null
  }

  if (isPasswordLogin.value || !isCodeLoginHumanVerified(emailAddress.value)) {
    clearCodeLoginHumanVerified()
  }
})

onMounted(() => {
  updatePuzzleSize()
  window.addEventListener('resize', updatePuzzleSize)
})

onBeforeUnmount(() => {
  if (codeCountdownTimer) {
    window.clearInterval(codeCountdownTimer)
  }

  window.removeEventListener('resize', updatePuzzleSize)
})
</script>

<style scoped>
.auth-form {
  width: 100%;
  display: grid;
  gap: 16px;
  margin-top: 40px;
  min-width: 0;
}

.auth-field {
  min-width: 0;
}

.auth-input-wrap {
  height: 60px;
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  padding: 0 19px;
  border: 1px solid var(--theme-extra-71-85-105-1);
  border-radius: 7px;
  background-color: var(--theme-extra-31-41-55-086);
}

.auth-input-wrap svg {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  color: var(--theme-text-muted);
}

.auth-input-wrap .auth-input-trailing-icon {
  width: 16px;
  height: 16px;
}

.auth-password-visibility-button {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: var(--theme-text-muted);
  cursor: pointer;
}

.auth-input-wrap input {
  min-width: 0;
  flex: 1;
  color: var(--theme-white);
  font-size: 16px;
}

.auth-input-wrap input::placeholder {
  color: var(--theme-text-muted);
}

.auth-code-button {
  flex: 0 0 auto;
  max-width: 112px;
  color: var(--theme-accent-brand);
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.auth-code-button:disabled {
  color: var(--theme-extra-148-163-184-082);
  cursor: not-allowed;
}

.auth-password-button {
  width: fit-content;
  max-width: 100%;
  margin-top: 8px;
  color: var(--theme-text-muted);
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.auth-agreement {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  min-width: 0;
  color: var(--theme-text-muted);
  font-size: 14px;
  line-height: 20px;
}

.auth-agreement input {
  margin-top: 2px;
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  accent-color: var(--theme-accent-brand);
}

.auth-agreement-copy {
  min-width: 0;
  text-align: left;
  overflow-wrap: anywhere;
}

.auth-agreement-action {
  color: var(--theme-accent-brand);
}

.auth-submit-button {
  height: 60px;
  margin-top: 17px;
  padding: 0 18px;
  border-radius: 9px;
  color: var(--theme-white);
  background: linear-gradient(90deg, var(--theme-extra-14-181-213-1), var(--theme-extra-14-145-233-1));
  font-size: 16px;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.2s ease;
}

.auth-submit-button:hover,
.auth-submit-button:focus {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.auth-submit-button:disabled,
.auth-submit-button:disabled:hover,
.auth-submit-button:disabled:focus {
  cursor: not-allowed;
  filter: grayscale(0.2) brightness(0.82);
  transform: none;
}

@media (max-width: 520px) {
  .auth-form {
    margin-top: 30px;
  }
}

/* 注销冷静期提示弹窗，样式与结算结果弹窗保持一致。 */
.cooling-period-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(2, 8, 18, 0.76);
  backdrop-filter: blur(4px);
}

.cooling-period-modal {
  width: min(420px, calc(100vw - 32px));
  padding: 30px 26px 26px;
  border: 1px solid #244363;
  border-radius: 14px;
  color: #f7fbff;
  background: #0b1b32;
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.46);
  text-align: center;
}

.cooling-period-icon {
  width: 64px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 1px solid rgba(245, 158, 11, 0.28);
  border-radius: 50%;
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.12);
}

.cooling-period-icon :deep(svg) {
  width: 30px;
  height: 30px;
}

.cooling-period-modal h2 {
  margin: 16px 0 0;
  color: #f8fbff;
  font-size: 22px;
  font-weight: 800;
  line-height: 30px;
}

.cooling-period-description {
  margin: 10px 0 0;
  color: #8290a5;
  font-size: 13px;
  line-height: 20px;
}

.cooling-period-endtime {
  margin: 12px 0 0;
  padding: 10px 14px;
  border: 1px solid rgba(245, 158, 11, 0.24);
  border-radius: 9px;
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
  font-size: 13px;
  line-height: 20px;
}

.cooling-period-endtime strong {
  color: #fde68a;
  font-weight: 700;
}

.cooling-period-actions {
  display: grid;
  justify-items: center;
  gap: 11px;
  margin-top: 22px;
}

.cooling-period-primary {
  width: min(246px, 100%);
  height: 42px;
  border-radius: 9px;
  color: #ffffff;
  background: linear-gradient(90deg, #11b7d8 0%, #2871ed 100%);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.18s ease, transform 0.18s ease, opacity 0.18s ease;
}

.cooling-period-primary:hover:not(:disabled) {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.cooling-period-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.cooling-period-secondary {
  height: 26px;
  padding: 0 10px;
  color: #8290a5;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.18s ease;
}

.cooling-period-secondary:hover {
  color: #c6d2e2;
}

:root[data-theme="light"] .cooling-period-modal {
  border-color: #cbd9e8;
  color: #13243a;
  background: #ffffff;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.22);
}

:root[data-theme="light"] .cooling-period-modal h2 {
  color: #102238;
}

:root[data-theme="light"] .cooling-period-description,
:root[data-theme="light"] .cooling-period-secondary {
  color: #65758a;
}

:root[data-theme="light"] .cooling-period-endtime {
  border-color: rgba(217, 119, 6, 0.24);
  background: rgba(253, 230, 138, 0.28);
  color: #b45309;
}

:root[data-theme="light"] .cooling-period-endtime strong {
  color: #92400e;
}
</style>
