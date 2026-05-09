<template>
  <form :class="['auth-form', `auth-form-${authMode}`]" @submit.prevent>
    <label class="auth-field">
      <span class="auth-input-wrap">
        <Icon name="lucide:mail" aria-hidden="true" />
        <input type="text" autocomplete="username" placeholder="请输入您的账号">
      </span>
    </label>

    <label class="auth-field">
      <span class="auth-input-wrap">
        <Icon name="lucide:lock-keyhole" aria-hidden="true" />
        <input
          :type="secondInputType"
          :inputmode="secondInputMode"
          :autocomplete="secondInputAutocomplete"
          :placeholder="secondInputPlaceholder"
        >
        <button v-if="showCodeButton" type="button" class="auth-code-button">获取验证码</button>
        <Icon v-else class="auth-input-trailing-icon" name="lucide:eye-off" aria-hidden="true" />
      </span>
    </label>

    <label v-if="authMode === 'register'" class="auth-field">
      <span class="auth-input-wrap">
        <Icon name="lucide:lock-keyhole" aria-hidden="true" />
        <input type="password" autocomplete="new-password" placeholder="请输入密码">
        <Icon class="auth-input-trailing-icon" name="lucide:eye-off" aria-hidden="true" />
      </span>
    </label>

    <label v-if="authMode === 'register'" class="auth-field">
      <span class="auth-input-wrap">
        <Icon name="lucide:lock-keyhole" aria-hidden="true" />
        <input type="text" autocomplete="off" placeholder="请输入邀请码">
      </span>
    </label>

    <button v-if="authMode === 'login'" type="button" class="auth-password-button" @click="$emit('toggle-login-method')">
      {{ loginMethodToggleText }}
    </button>

    <button type="submit" class="auth-submit-button">
      {{ submitText }}
    </button>

    <p class="auth-switch-copy">
      {{ switchPrompt }}
      <button type="button" @click="$emit('toggle-mode')">{{ switchAction }}</button>
    </p>

    <label class="auth-agreement">
      <input v-model="agreementModel" type="checkbox">
      <span>
        我已阅读并同意
        <a href="#">《隐私政策》</a>
        和
        <a href="#">《用户协议》</a>
      </span>
    </label>
  </form>
</template>

<script setup>
const props = defineProps({
  authMode: {
    type: String,
    required: true,
  },
  agreementAccepted: {
    type: Boolean,
    required: true,
  },
  loginMethod: {
    type: String,
    default: 'code',
  },
})

const emit = defineEmits(['toggle-mode', 'toggle-login-method', 'update:agreementAccepted'])

const agreementModel = computed({
  get: () => props.agreementAccepted,
  set: value => emit('update:agreementAccepted', value),
})

const submitText = computed(() => props.authMode === 'login' ? '立即登录' : '立即注册')
const switchPrompt = computed(() => props.authMode === 'login' ? '没有账号？' : '已有账号？')
const switchAction = computed(() => props.authMode === 'login' ? '立即注册' : '去登录')
const isPasswordLogin = computed(() => props.authMode === 'login' && props.loginMethod === 'password')
const showCodeButton = computed(() => props.authMode === 'login' && !isPasswordLogin.value)
const secondInputType = computed(() => isPasswordLogin.value ? 'password' : 'text')
const secondInputMode = computed(() => isPasswordLogin.value ? undefined : 'numeric')
const secondInputAutocomplete = computed(() => {
  if (props.authMode === 'register') {
    return 'one-time-code'
  }

  return isPasswordLogin.value ? 'current-password' : 'one-time-code'
})
const secondInputPlaceholder = computed(() => isPasswordLogin.value ? '请输入密码' : '请输入验证码')
const loginMethodToggleText = computed(() => isPasswordLogin.value ? '验证码登录' : '密码登录')
</script>

<style scoped>
.auth-form {
  width: 100%;
  display: grid;
  gap: 16px;
  margin-top: 40px;
  min-width: 0;
}

.auth-form-register {
  gap: 16px;
  margin-top: 35px;
}

.auth-form-register .auth-submit-button {
  margin-top: 6px;
}

.auth-form-register .auth-switch-copy {
  margin-top: 6px;
}

.auth-form-register .auth-agreement {
  margin-top: 0;
}

.auth-field {
  min-width: 0;
}

.auth-input-wrap {
  height: 60px;
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;
  padding: 0 19px;
  border: 1px solid rgba(71, 85, 105, 1);
  border-radius: 7px;
  background-color: rgba(31, 41, 55, 0.86);
}

.auth-input-wrap svg {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  color: rgba(148, 163, 184, 1);
}

.auth-input-wrap .auth-input-trailing-icon {
  width: 16px;
  height: 16px;
}

.auth-input-wrap input {
  min-width: 0;
  flex: 1;
  color: rgba(255, 255, 255, 1);
  font-size: 16px;
}

.auth-input-wrap input::placeholder {
  color: rgba(148, 163, 184, 1);
}

.auth-code-button {
  flex: 0 1 auto;
  max-width: 150px;
  color: rgba(20, 198, 239, 1);
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.auth-password-button {
  width: fit-content;
  max-width: 100%;
  margin-top: 8px;
  color: rgba(148, 163, 184, 1);
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
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 0;
  color: rgba(148, 163, 184, 1);
  font-size: 14px;
  line-height: 20px;
}

.auth-agreement input {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  accent-color: rgba(20, 198, 239, 1);
}

.auth-agreement span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.auth-agreement a,
.auth-switch-copy button {
  color: rgba(20, 198, 239, 1);
}

.auth-submit-button {
  height: 60px;
  margin-top: 17px;
  padding: 0 18px;
  border-radius: 9px;
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(90deg, rgba(14, 181, 213, 1), rgba(14, 145, 233, 1));
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

.auth-switch-copy {
  margin-top: 103px;
  color: rgba(148, 163, 184, 1);
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  overflow-wrap: anywhere;
}

.auth-switch-copy button {
  cursor: pointer;
}

@media (max-width: 520px) {
  .auth-form {
    margin-top: 30px;
  }

  .auth-switch-copy,
  .auth-form-register .auth-switch-copy {
    margin-top: 40px;
  }
}
</style>
