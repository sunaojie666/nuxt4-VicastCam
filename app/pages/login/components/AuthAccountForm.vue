<template>
  <form class="auth-form" @submit.prevent="handleLoginSubmit">
    <label class="auth-field">
      <span class="auth-input-wrap">
        <Icon name="lucide:mail" aria-hidden="true" />
        <input
          v-model.trim="emailAddress"
          :type="isPasswordLogin ? 'text' : 'email'"
          :inputmode="isPasswordLogin ? 'text' : 'email'"
          autocomplete="username"
          :placeholder="accountPlaceholder"
        >
      </span>
    </label>

    <label class="auth-field">
      <span class="auth-input-wrap">
        <Icon name="lucide:lock-keyhole" aria-hidden="true" />
        <input
          v-model="loginCredential"
          :type="credentialInputType"
          :inputmode="isPasswordLogin ? undefined : 'numeric'"
          :autocomplete="isPasswordLogin ? 'current-password' : 'one-time-code'"
          :placeholder="credentialPlaceholder"
        >
        <button
          v-if="!isPasswordLogin"
          type="button"
          class="auth-code-button"
          :disabled="isSendingCode || codeCountdown > 0"
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

    <button type="submit" class="auth-submit-button" :disabled="isLoggingIn">
      {{ submitButtonText }}
    </button>

    <label class="auth-agreement">
      <input v-model="agreementModel" type="checkbox">
      <span class="auth-agreement-copy">
        <span v-if="loginBox.agreeProtocolPrefix">{{ loginBox.agreeProtocolPrefix }}</span>
        <span v-if="loginBox.privacyPolicyText" class="auth-agreement-action">《{{ loginBox.privacyPolicyText }}》</span>
        <span v-if="loginBox.privacyPolicyText && loginBox.userProtocolText && agreementConnector">{{ agreementConnector }}</span>
        <span v-if="loginBox.userProtocolText" class="auth-agreement-action">《{{ loginBox.userProtocolText }}》</span>
      </span>
    </label>
  </form>
</template>

<script setup>
import { sendEmailCode } from '../../../api/request/auth'

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

const agreementModel = defineModel('agreementAccepted', {
  type: Boolean,
  required: true,
})
const { requestLoadingText, showErrorToast, showRequestFailToast, showRequestSuccessToast } = useSiteToast()
const { loginWithEmailCode, loginWithPassword } = useAuth()
const localePath = useLocalePath()

const emailAddress = ref('')
const loginCredential = ref('')
const isSendingCode = ref(false)
const isLoggingIn = ref(false)
const showPassword = ref(false)
const codeCountdown = ref(0)
let codeCountdownTimer = null

const loginBox = computed(() => props.loginBox || {})
const toastBox = computed(() => props.toastBox || {})
const isPasswordLogin = computed(() => props.loginMethod === 'password')
const accountPlaceholder = computed(() => {
  return loginBox.value.emailInputPlaceholder
})
const credentialPlaceholder = computed(() => {
  return isPasswordLogin.value ? loginBox.value.pwdInputPlaceholder : loginBox.value.verifyCodePlaceholder
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

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const validateEmail = () => {
  const email = emailAddress.value.trim()

  if (!email) {
    showErrorToast(toastBox.value.emailRequired || '')
    return ''
  }

  if (!isValidEmail(email)) {
    showErrorToast(toastBox.value.emailRequired || '')
    return ''
  }

  return email
}

const validateAccount = () => {
  const account = emailAddress.value.trim()

  if (!account) {
    showErrorToast(toastBox.value.emailRequired || '')
    return ''
  }

  return account
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
  const email = validateEmail()

  if (!email) {
    return
  }

  isSendingCode.value = true

  sendEmailCode(email).then(
    () => {
      isSendingCode.value = false
      showRequestSuccessToast()
      startCodeCountdown()
    },
    () => {
      isSendingCode.value = false
      showRequestFailToast()
    }
  )
}

// 邮箱验证码登录提交 email/captcha；密码登录提交 account/password。
const handleLoginSubmit = () => {
  const account = isPasswordLogin.value ? validateAccount() : validateEmail()
  const credential = loginCredential.value.trim()

  if (!account) {
    return
  }

  if (!credential) {
    showErrorToast(isPasswordLogin.value ? (toastBox.value.passwordRequired || '') : (toastBox.value.verifyCodeRequired || ''))
    return
  }

  if (!agreementModel.value) {
    showErrorToast(toastBox.value.agreeProtocolRequired || '')
    return
  }

  isLoggingIn.value = true

  const loginRequest = isPasswordLogin.value
    ? loginWithPassword({ account, password: credential })
    : loginWithEmailCode({ email: account, captcha: credential })

  loginRequest.then(
    () => {
      isLoggingIn.value = false
      showRequestSuccessToast()
      navigateTo(localePath('/'))
    },
    () => {
      isLoggingIn.value = false
      showRequestFailToast()
    }
  )
}

onBeforeUnmount(() => {
  if (codeCountdownTimer) {
    window.clearInterval(codeCountdownTimer)
  }
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
</style>
