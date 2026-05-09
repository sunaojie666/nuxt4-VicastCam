<template>
  <main class="auth-page">
    <div class="auth-layout">
      <section class="auth-brand-panel" aria-labelledby="auth-brand-title">
        <NuxtLink :to="localePath('/')" class="auth-logo">
          <img src="/images/website.png" alt="" aria-hidden="true">
          <span>Vicast<span>Cam</span></span>
        </NuxtLink>

        <div class="auth-brand-copy">
          <h1 id="auth-brand-title">
            <span>一键更换虚拟背景</span>
            <span>直播更精彩</span>
          </h1>
          <p>
            <span>先进的抠图技术，创造真实自然的虚拟场景</span>
            <span>让每一次直播都专业出彩</span>
          </p>
        </div>

        <div class="auth-feature-list" aria-label="VicastCam特色">
          <div v-for="(feature, index) in features" :key="feature.title" class="auth-feature">
            <span>
              <img v-if="index === 0" src="/images/loginIcon1.png" alt="" aria-hidden="true">
              <img v-else-if="index === 1" src="/images/loginIcon2.png" alt="" aria-hidden="true">
              <img v-else src="/images/loginIcon3.png" alt="" aria-hidden="true">
            </span>
            <strong>{{ feature.title }}</strong>
            <small>{{ feature.description }}</small>
          </div>
        </div>
      </section>

      <section class="auth-card" aria-labelledby="auth-form-title">
        <div class="auth-tabs" role="tablist" aria-label="登录注册切换">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            :class="['auth-tab', { 'auth-tab-active': authMode === tab.value }]"
            role="tab"
            :aria-selected="authMode === tab.value"
            @click="authMode = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

        <form :class="['auth-form', `auth-form-${authMode}`]" @submit.prevent>
          <h2 id="auth-form-title" class="auth-form-title">{{ activeTitle }}</h2>

          <label class="auth-field">
            <span>账号</span>
            <span class="auth-input-wrap">
              <Icon name="lucide:mail" aria-hidden="true" />
              <input type="text" autocomplete="username" placeholder="请输入您的账号">
            </span>
          </label>

          <label class="auth-field">
            <span>验证码</span>
            <span class="auth-input-wrap">
              <Icon name="lucide:lock-keyhole" aria-hidden="true" />
              <input type="text" inputmode="numeric" autocomplete="one-time-code" placeholder="请输入验证码">
              <button type="button" class="auth-code-button">获取验证码</button>
            </span>
          </label>

          <label v-if="authMode === 'register'" class="auth-field">
            <span>邀请码</span>
            <span class="auth-input-wrap">
              <Icon name="lucide:ticket" aria-hidden="true" />
              <input type="text" autocomplete="off" placeholder="请输入邀请码">
            </span>
          </label>

          <label class="auth-agreement">
            <input v-model="agreementAccepted" type="checkbox">
            <span>
              我已阅读并同意
              <a href="#">《隐私政策》</a>
              和
              <a href="#">《用户协议》</a>
            </span>
          </label>

          <button type="submit" class="auth-submit-button">
            {{ submitText }}
          </button>

          <p class="auth-switch-copy">
            {{ switchPrompt }}
            <button type="button" @click="toggleMode">{{ switchAction }}</button>
          </p>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
const localePath = useLocalePath()
const authMode = ref('login')
const agreementAccepted = ref(true)

const tabs = [
  { value: 'login', label: '登录' },
  { value: 'register', label: '注册' },
]

const features = [
  { title: '智能抠图', description: '精准识别' },
  { title: '海量模板', description: '随心切换' },
  { title: '虚拟相机', description: '专业直播' },
]

const activeTitle = computed(() => authMode.value === 'login' ? '登录' : '注册')
const submitText = computed(() => authMode.value === 'login' ? '立即登录' : '立即注册')
const switchPrompt = computed(() => authMode.value === 'login' ? '没有账号？' : '已有账号？')
const switchAction = computed(() => authMode.value === 'login' ? '立即注册' : '立即登录')

const toggleMode = () => {
  authMode.value = authMode.value === 'login' ? 'register' : 'login'
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
  padding: 16.39dvh 10.68vw 16.3dvh 10.73vw;
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
  width: 100%;
  max-width: 1509px;
  display: grid;
  grid-template-columns: minmax(260px, 1fr) min(33.75vw, 648px);
  align-items: start;
  gap: clamp(24px, 2.5vw, 48px);
  margin: 0 auto;
  min-width: 0;
}

.auth-brand-panel,
.auth-card {
  position: relative;
  z-index: 1;
}

.auth-logo {
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 1);
  font-size: 24px;
  font-weight: 900;
  min-width: 0;
}

.auth-logo img {
  width: 44px;
  height: 44px;
  border-radius: 4px;
}

.auth-logo span span {
  color: rgba(20, 198, 239, 1);
}

.auth-logo > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auth-brand-copy {
  margin-top: 34px;
}

.auth-brand-copy h1 {
  font-size: 48px;
  font-weight: 900;
  line-height: 62px;
  overflow-wrap: anywhere;
}

.auth-brand-copy h1 span {
  display: block;
}

.auth-brand-copy h1 span:last-child {
  position: relative;
  width: fit-content;
  color: rgba(20, 198, 239, 1);
}

.auth-brand-copy h1 span:last-child::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -13px;
  width: 198px;
  height: 10px;
  border-bottom: 2px solid rgba(103, 232, 249, 1);
  border-radius: 50%;
}

.auth-brand-copy p {
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  color: rgba(226, 232, 240, 1);
  font-size: 20px;
  line-height: 30px;
  overflow-wrap: anywhere;
}

.auth-feature-list {
  display: flex;
  gap: clamp(28px, 3.02vw, 58px);
  margin-top: 190px;
  min-width: 0;
}

.auth-feature {
  width: 68px;
  min-width: 0;
  display: grid;
  justify-items: center;
  color: rgba(203, 213, 225, 1);
  text-align: center;
}

.auth-feature > span {
  width: 68px;
  height: 68px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(20, 198, 239, 0.36);
  border-radius: 50%;
  color: rgba(20, 198, 239, 1);
  background-color: rgba(15, 23, 42, 0.76);
}

.auth-feature img {
  width: 30px;
  height: 30px;
  display: block;
  object-fit: contain;
}

.auth-feature strong {
  max-width: 100%;
  margin-top: 16px;
  color: rgba(255, 255, 255, 1);
  font-size: 10px;
  font-weight: 700;
  line-height: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auth-feature small {
  max-width: 100%;
  margin-top: 14px;
  color: rgba(148, 163, 184, 1);
  font-size: 9px;
  line-height: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auth-card {
  width: min(33.75vw, 648px);
  height: min(calc(100dvh - 32.69dvh), 727px);
  max-height: 727px;
  overflow: hidden;
  justify-self: end;
  padding: clamp(42px, 8.67%, 63px) clamp(38px, 9.41%, 61px) clamp(36px, 7.7%, 56px);
  border: 1px solid rgba(30, 41, 59, 1);
  border-radius: 8px;
  background-color: rgba(15, 23, 42, 0.94);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.auth-tabs {
  width: min(100%, 512px);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: 46px;
  overflow: visible;
  border: 0;
  border-radius: 10px;
  background-color: transparent;
}

.auth-tab {
  width: 100%;
  min-width: 0;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  opacity: 1;
  border: 1px solid transparent;
  border-radius: 10px;
  box-sizing: border-box;
  color: rgba(148, 163, 184, 1);
  font-size: 24px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.auth-tab-active {
  border: 1px solid transparent;
  color: rgba(255, 255, 255, 1);
  background:
    linear-gradient(90deg, rgba(6, 180, 212, 0.2) 0%, rgba(36, 101, 235, 0.2) 100%) padding-box,
    linear-gradient(rgba(14, 21, 38, 1), rgba(14, 21, 38, 1)) padding-box,
    linear-gradient(90deg, rgba(6, 181, 212, 1) 0%, rgba(36, 101, 235, 1) 100%) border-box;
}

.auth-form {
  width: min(100%, 526px);
  display: grid;
  gap: 16px;
  margin-top: 58px;
  min-width: 0;
}

.auth-form-register {
  gap: 8px;
  margin-top: 24px;
}

.auth-form-register .auth-field {
  gap: 6px;
}

.auth-form-register .auth-submit-button {
  margin-top: 4px;
}

.auth-form-title {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.auth-field {
  display: grid;
  gap: 10px;
  min-width: 0;
  color: rgba(148, 163, 184, 1);
  font-size: 24px;
}

.auth-field > span:first-child {
  min-width: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
}

.auth-input-wrap {
  height: 60px;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 0 12px;
  border: 1px solid rgba(51, 65, 85, 1);
  border-radius: 5px;
  background-color: rgba(31, 41, 55, 1);
}

.auth-input-wrap svg {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  color: rgba(148, 163, 184, 1);
}

.auth-input-wrap input {
  min-width: 0;
  flex: 1;
  color: rgba(255, 255, 255, 1);
  font-size: 20px;
}

.auth-input-wrap input::placeholder {
  color: rgba(148, 163, 184, 1);
}

.auth-code-button {
  flex: 0 1 auto;
  max-width: 150px;
  color: rgba(20, 198, 239, 1);
  font-size: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.auth-agreement {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: rgba(148, 163, 184, 1);
  font-size: 18px;
  line-height: 26px;
}

.auth-agreement input {
  width: 12px;
  height: 12px;
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
  margin-top: 24px;
  padding: 0 18px;
  border-radius: 5px;
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(90deg, rgba(14, 181, 213, 1), rgba(14, 145, 233, 1));
  font-size: 24px;
  font-weight: 900;
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
  color: rgba(148, 163, 184, 1);
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  overflow-wrap: anywhere;
}

.auth-switch-copy button {
  cursor: pointer;
}

@media (max-width: 900px) {

  .auth-page {
    height: auto;
    min-height: 100dvh;
    overflow: hidden;
    padding: 48px 20px;
  }

  .auth-layout {
    grid-template-columns: 1fr;
    gap: 42px;
  }

  .auth-card {
    width: min(100%, 648px);
    max-height: none;
    min-width: 0;
    min-height: 0;
    justify-self: center;
    padding: 28px;
  }

  .auth-feature-list {
    margin-top: 54px;
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
    width: min(44vw, 648px);
  }
}

@media (max-width: 520px) {

  .auth-page {
    padding: 32px 16px;
  }

  .auth-brand-copy h1 {
    font-size: 26px;
    line-height: 36px;
  }

  .auth-brand-copy p {
    font-size: 12px;
  }

  .auth-feature-list {
    justify-content: space-between;
    gap: 16px;
  }

  .auth-card {
    min-height: auto;
    padding: 22px;
  }
}
</style>
