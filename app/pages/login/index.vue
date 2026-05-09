<template>
  <main class="auth-page">
    <div class="auth-layout">
      <AuthBrandPanel />

      <NuxtLink :to="localePath('/')" class="auth-mobile-logo" aria-label="VicastCam首页">
        <img src="/images/website.png" alt="" aria-hidden="true">
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
          :auth-mode="authMode"
          :login-method="loginMethod"
          @toggle-mode="toggleMode"
          @toggle-login-method="toggleLoginMethod"
        />
        <AuthScanPanel v-else @register="showRegister" />
      </section>
    </div>
  </main>
</template>

<script setup>
import AuthAccountForm from './components/AuthAccountForm.vue'
import AuthBrandPanel from './components/AuthBrandPanel.vue'
import AuthScanPanel from './components/AuthScanPanel.vue'

const localePath = useLocalePath()
const authMode = ref('login')
const loginView = ref('account')
const loginMethod = ref('code')
const agreementAccepted = ref(true)

const authCardTitle = computed(() => {
  if (loginView.value === 'scan') {
    return '扫码登录'
  }

  return authMode.value === 'login' ? '账号登录' : '注册账号'
})
const headingIcon = computed(() => loginView.value === 'scan' ? '/images/scanCode.png' : '/images/Email.png')
const cornerIcon = computed(() => loginView.value === 'scan' ? '/images/Lock.png' : '/images/QR.png')
const cornerLabel = computed(() => loginView.value === 'scan' ? '切换账号登录' : '切换扫码登录')

const toggleMode = () => {
  authMode.value = authMode.value === 'login' ? 'register' : 'login'
  loginMethod.value = 'code'
}

const toggleLoginMethod = () => {
  loginMethod.value = loginMethod.value === 'code' ? 'password' : 'code'
}

const toggleLoginView = () => {
  loginView.value = loginView.value === 'account' ? 'scan' : 'account'
  if (loginView.value === 'scan') {
    authMode.value = 'login'
  }
}

const showRegister = () => {
  authMode.value = 'register'
  loginView.value = 'account'
  loginMethod.value = 'code'
}

useSeoMeta({
  title: '登录注册',
  description: '登录或注册 VicastCam 账号。',
})
</script>

<style>
.auth-page {
  position: relative;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 10.68vw 32px 10.73vw;
  color: rgba(255, 255, 255, 1);
  background:
    linear-gradient(90deg, rgba(3, 7, 18, 0.08) 0%, rgba(3, 7, 18, 0.12) 45%, rgba(3, 7, 18, 0.28) 100%),
    url("/images/loginbg.png") center / cover no-repeat,
    rgba(3, 7, 18, 1);
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
  height: 621px;
  max-height: 621px;
  overflow: hidden;
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
  max-width: 100%;
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
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  overflow-wrap: anywhere;
}

@media (max-width: 900px) {

  .auth-page {
    height: auto;
    min-height: 100dvh;
    overflow: hidden;
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
    height: auto;
    max-height: none;
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
    grid-template-columns: minmax(240px, 1fr) minmax(420px, 44vw);
  }

  .auth-card {
    width: min(44vw, 476px);
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
