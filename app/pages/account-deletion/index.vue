<template>
  <div class="account-deletion-page-shell">
    <SiteHeader />

    <main class="account-deletion-page-main">
      <section
        class="account-deletion-hero-section"
        aria-labelledby="account-deletion-hero-title"
      >
        <div class="account-deletion-hero-inner">
          <span class="account-deletion-hero-eyebrow">{{ copy.page.eyebrow }}</span>

          <h1 id="account-deletion-hero-title" class="account-deletion-hero-title">
            <span>{{ copy.page.titleMain }}</span><span class="theme-gradient-text">{{ copy.page.titleHighlight }}</span>
          </h1>

          <p class="account-deletion-hero-subtitle">
            {{ copy.page.subtitle }}
          </p>
        </div>
      </section>

      <div class="page-container account-deletion-layout">
        <article class="account-deletion-content-card">
          <div class="account-deletion-article">
              <section class="account-deletion-section">
                <div class="account-deletion-section-heading">
                  <span class="account-deletion-section-icon">
                    <Icon name="lucide:scale" aria-hidden="true" />
                  </span>
                  <h2>{{ copy.sections.legalRights.title }}</h2>
                </div>
                <p>
                  {{ copy.sections.legalRights.text }}
                </p>
              </section>

              <section class="account-deletion-section">
                <div class="account-deletion-section-heading">
                  <span class="account-deletion-section-icon">
                    <Icon name="lucide:database" aria-hidden="true" />
                  </span>
                  <h2>{{ copy.sections.deletionData.title }}</h2>
                </div>
                <p>
                  {{ copy.sections.deletionData.text }}
                </p>

                <div class="account-deletion-timeline">
                  <div
                    v-for="item in copy.timeline"
                    :key="item.label"
                    class="account-deletion-timeline-item"
                  >
                    <strong>{{ item.label }}</strong>
                    <span>{{ item.text }}</span>
                  </div>
                </div>
              </section>

              <section class="account-deletion-section">
                <div class="account-deletion-section-heading">
                  <span class="account-deletion-section-icon">
                    <Icon name="lucide:ban" aria-hidden="true" />
                  </span>
                  <h2>{{ copy.sections.lostServices.title }}</h2>
                </div>

                <div class="account-deletion-loss-list">
                  <article
                    v-for="(item, itemIndex) in copy.sections.lostServices.items"
                    :key="itemIndex"
                    class="account-deletion-loss-item"
                  >
                    <span class="account-deletion-loss-icon">
                      <Icon :name="lostServiceIcons[itemIndex] || 'lucide:circle-alert'" aria-hidden="true" />
                    </span>
                    <div class="account-deletion-loss-copy">
                      <h3>{{ item.title }}</h3>
                      <p>{{ item.text }}</p>
                    </div>
                  </article>
                </div>
              </section>

              <section class="account-deletion-section">
                <div class="account-deletion-section-heading">
                  <span class="account-deletion-section-icon">
                    <Icon name="lucide:archive" aria-hidden="true" />
                  </span>
                  <h2>{{ copy.sections.retention.title }}</h2>
                </div>
                <p>
                  {{ copy.sections.retention.text }}
                </p>
              </section>

            </div>
          </article>

          <div class="account-deletion-actions">
            <div class="account-deletion-actions-copy">
              <p class="account-deletion-actions-prompt">
                <span class="account-deletion-actions-prompt-icon" aria-hidden="true">
                  <Icon name="lucide:triangle-alert" />
                </span>
                <span>{{ copy.actions.confirmPrompt }}</span>
              </p>

              <div class="account-deletion-actions-policy" :aria-label="copy.page.policyLinksAriaLabel">
                <template v-for="(link, linkIndex) in copy.policyLinks" :key="link.path">
                  <span v-if="linkIndex > 0" class="account-deletion-actions-policy-divider" aria-hidden="true">丨</span>
                  <NuxtLink :to="localePath(link.path)">
                    <span>{{ link.label }}</span>
                  </NuxtLink>
                </template>
              </div>
            </div>

            <div class="account-deletion-actions-buttons">
              <button
                type="button"
                class="account-deletion-action account-deletion-action-secondary"
                @click="handleThinkAgain"
              >
                {{ copy.actions.thinkAgain }}
              </button>
              <button
                type="button"
                class="account-deletion-action account-deletion-action-primary"
                @click="openConfirmModal"
              >
                {{ copy.actions.submit }}
              </button>
            </div>
          </div>
      </div>
    </main>

    <Teleport to="body">
      <div
        v-if="flowStep === 'confirm' || flowStep === 'verify' || flowStep === 'submitted'"
        class="account-deletion-backdrop"
        @click.self="closeConfirmModal"
      >
        <section
          class="account-deletion-modal"
          :class="{ 'account-deletion-modal-success': flowStep === 'submitted' }"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="flowStep === 'confirm' ? 'account-deletion-confirm-title' : (flowStep === 'verify' ? 'account-deletion-verify-title' : 'account-deletion-success-title')"
        >
          <button
            v-if="flowStep !== 'submitted'"
            type="button"
            class="account-deletion-modal-close"
            :aria-label="copy.page.closeLabel"
            @click="closeConfirmModal"
          >
            <Icon name="lucide:x" aria-hidden="true" />
          </button>

          <template v-if="flowStep === 'confirm'">
            <span class="account-deletion-modal-icon">
              <Icon name="lucide:triangle-alert" aria-hidden="true" />
            </span>

            <h2 id="account-deletion-confirm-title">{{ copy.confirm.title }}</h2>

            <p class="account-deletion-modal-description">
              {{ copy.confirm.description }}
            </p>

            <ul class="account-deletion-modal-warnings">
              <li v-for="(warning, warningIndex) in copy.confirm.warnings" :key="warningIndex">
                <Icon name="lucide:circle-alert" aria-hidden="true" />
                <span>{{ warning }}</span>
              </li>
            </ul>

            <div class="account-deletion-modal-actions">
              <button
                type="button"
                class="account-deletion-modal-primary"
                @click="confirmDeletion"
              >
                {{ copy.confirm.submit }}
              </button>
              <button
                type="button"
                class="account-deletion-modal-secondary"
                @click="closeConfirmModal"
              >
                {{ copy.actions.thinkAgain }}
              </button>
            </div>
          </template>

          <template v-else-if="flowStep === 'verify'">
            <span class="account-deletion-modal-icon account-deletion-modal-icon-verify">
              <Icon name="lucide:mail-check" aria-hidden="true" />
            </span>

            <h2 id="account-deletion-verify-title">{{ copy.verify.title }}</h2>

            <p class="account-deletion-modal-description">
              {{ copy.verify.description }}
            </p>

            <div class="account-deletion-verify-email-field">
              <span class="account-deletion-verify-email-wrap">
                <input
                  v-model="verifyEmail"
                  class="account-deletion-verify-email-input"
                  type="email"
                  inputmode="email"
                  autocomplete="email"
                  :placeholder="copy.verify.emailPlaceholder"
                  @keyup.enter="sendDeletionEmailCode"
                >
                <button
                  type="button"
                  class="account-deletion-verify-code-text"
                  :disabled="codeCountdown > 0 || isSendingCode"
                  @click="sendDeletionEmailCode"
                >
                  {{ isSendingCode ? copy.verify.sending : (codeCountdown > 0 ? `${codeCountdown}s` : copy.verify.getCode) }}
                </button>
              </span>
            </div>

            <input
              v-model="verifyCode"
              class="account-deletion-verify-input"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="6"
              :placeholder="copy.verify.codePlaceholder"
              @keyup.enter="handleVerifySubmit"
            >

            <div class="account-deletion-verify-resend">
              <span>{{ copy.verify.resendPrefix }}</span>
              <button
                type="button"
                :disabled="codeCountdown > 0 || isSendingCode"
                @click="sendDeletionEmailCode"
              >
                {{ codeCountdown > 0 ? `${copy.verify.resend}（${codeCountdown}s）` : copy.verify.resend }}
              </button>
            </div>

            <div class="account-deletion-modal-actions">
              <button
                type="button"
                class="account-deletion-modal-primary"
                :disabled="isVerifying"
                @click="handleVerifySubmit"
              >
                {{ isVerifying ? copy.verify.verifying : copy.verify.submit }}
              </button>
              <button
                type="button"
                class="account-deletion-modal-secondary"
                @click="goBackToConfirm"
              >
                {{ copy.verify.back }}
              </button>
            </div>
          </template>

          <template v-else>
            <span class="account-deletion-modal-icon account-deletion-success-modal-icon">
              <Icon name="lucide:shield-check" aria-hidden="true" />
            </span>

            <h2 id="account-deletion-success-title">{{ copy.success.title }}</h2>

            <p class="account-deletion-modal-description">
              {{ copy.success.descriptionPrefix }}<strong class="account-deletion-success-period">{{ copy.success.coolingPeriodLabel }}</strong>{{ copy.success.descriptionSuffix }}
            </p>

            <div class="account-deletion-success-note">
              {{ copy.success.note }}
            </div>

            <div class="account-deletion-success-actions">
              <button
                type="button"
                class="account-deletion-modal-primary"
                @click="closeSuccessPanel"
              >
                {{ copy.success.confirm }}
              </button>
            </div>
          </template>
        </section>
      </div>
    </Teleport>

    <SiteFooter />
  </div>
</template>

<script setup>
import { cancelAccount, sendEmailCode, validCaptcha } from '../../api/request/auth'
import SiteFooter from '../../components/SiteFooter.vue'
import SiteHeader from '../../components/SiteHeader.vue'
import { useAccountDeletionCopy } from '../../composables/useAccountDeletionCopy'
import { useAuth } from '../../composables/useAuth'
import { useSiteToast } from '../../composables/useSiteToast'
import { createApiResponseError, getApiResponseDefinition } from '../../utils/api-response'
import { createLoginPath } from '../../utils/auth-redirect'
import { clearAuthStorage, isLoggedInUser } from '../../utils/auth-session'
import { setupPageSeo } from '../../utils/seo'

const localePath = useLocalePath()
const { authUser } = useAuth()
const { showApiResponseErrorToast, showApiResponseSuccessToast, showToast } = useSiteToast()
const { copy } = useAccountDeletionCopy()

const lostServiceIcons = ['lucide:user-round', 'lucide:film', 'lucide:crown']

const flowStep = ref('idle')
const verifyEmail = ref('')
const verifyCode = ref('')
const isSendingCode = ref(false)
const isVerifying = ref(false)
const codeCountdown = ref(0)
let codeCountdownTimer = null

const openConfirmModal = () => {
  if (!isLoggedInUser(authUser.value)) {
    navigateTo(createLoginPath(localePath('/account-deletion')))
    return
  }

  flowStep.value = 'confirm'
}

const closeConfirmModal = () => {
  flowStep.value = 'idle'
}

const getAccountUserId = () => String(authUser.value?.user_id || '').trim()

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())

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
    }
  }, 1000)
}

const sendDeletionEmailCode = () => {
  if (isSendingCode.value) {
    return
  }

  if (!isLoggedInUser(authUser.value)) {
    navigateTo(createLoginPath(localePath('/account-deletion')))
    return
  }

  const email = String(verifyEmail.value || '').trim()

  if (!email) {
    showToast({ message: copy.value.toasts.emailRequired, type: 'error' })
    return
  }

  if (!isValidEmail(email)) {
    showToast({ message: copy.value.toasts.emailInvalid, type: 'error' })
    return
  }

  isSendingCode.value = true

  // 服务端代理到 https://api.vicastcam.com/v1/SendEmail，type 为 cancel。
  sendEmailCode(email, 'cancel').then(
    (response) => {
      isSendingCode.value = false
      showApiResponseSuccessToast(response, { scope: 'auth' })
      startCodeCountdown()
      flowStep.value = 'verify'
    },
    (error) => {
      isSendingCode.value = false
      showApiResponseErrorToast(error, {
        scope: 'auth',
        fallback: copy.value.toasts.sendFailed,
      })
    }
  )
}

const confirmDeletion = () => {
  flowStep.value = 'verify'
}

const goBackToConfirm = () => {
  flowStep.value = 'confirm'
}

const assertResponseSuccess = (response, scope) => {
  const definition = getApiResponseDefinition(response, scope)

  if (definition?.type === 'error') {
    throw createApiResponseError(response, scope)
  }

  return response
}

const verifyAccountDeletion = ({ user_id }) => {
  // 服务端代理到 https://api.vicastcam.com/v1/AccountCancel，只传 user_id；
  // 后端返回成功即代表账号注销成功。
  return cancelAccount({ user_id }).then(response => assertResponseSuccess(response, 'account'))
}

const validateEmailCaptcha = ({ user_id, captcha }) => {
  // 服务端代理到 https://api.vicastcam.com/v1/ValidCaptcha，校验邮箱验证码。
  return validCaptcha({ user_id, captcha }).then(response => assertResponseSuccess(response, 'auth'))
}

const closeSuccessPanel = () => {
  flowStep.value = 'idle'
}

const handleThinkAgain = () => {
  navigateTo(localePath('/'))
}

const handleVerifySubmit = () => {
  if (isVerifying.value) {
    return
  }

  const code = verifyCode.value.trim()
  const email = String(verifyEmail.value || '').trim()

  if (!code) {
    showToast({ message: copy.value.toasts.codeRequired, type: 'error' })
    return
  }

  if (!email || !isValidEmail(email)) {
    showToast({ message: copy.value.toasts.emailInvalid, type: 'error' })
    return
  }

  const userId = getAccountUserId()

  if (!userId) {
    showToast({ message: copy.value.toasts.loginExpired, type: 'error' })
    return
  }

  isVerifying.value = true

  validateEmailCaptcha({ user_id: userId, captcha: code }).then(
    () => verifyAccountDeletion({ user_id: userId }),
  ).then(
    (response) => {
      isVerifying.value = false
      verifyCode.value = ''
      verifyEmail.value = ''
      showApiResponseSuccessToast(response, {
        scope: 'account',
        fallback: copy.value.toasts.cancelSuccess,
      })
      clearAuthStorage()
      flowStep.value = 'submitted'
    },
    (error) => {
      isVerifying.value = false
      showApiResponseErrorToast(error, {
        scope: 'auth',
        fallback: copy.value.toasts.verifyFailed,
      })
    }
  )
}

watch(flowStep, (step) => {
  if (!process.client) {
    return
  }

  document.body.style.overflow = step === 'confirm' || step === 'verify' || step === 'submitted' ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (codeCountdownTimer) {
    window.clearInterval(codeCountdownTimer)
    codeCountdownTimer = null
  }

  if (process.client && document.body.style.overflow === 'hidden') {
    document.body.style.overflow = ''
  }
})

setupPageSeo('account-deletion', () => ({
  title: copy.value.seo.title,
  description: copy.value.seo.description,
}))
</script>

<style scoped>
.account-deletion-page-shell {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: clip;
  padding-top: var(--page-header-height);
  color: var(--theme-text);
  background: var(--page-route-background);
}

.account-deletion-page-main {
  width: 100%;
  flex: 1;
  background: var(--page-route-background);
}

.account-deletion-hero-section {
  width: 100%;
  display: flex;
  justify-content: center;
  color: var(--theme-route-card-title, var(--theme-white));
  background:
    radial-gradient(circle at 50% 42%, var(--theme-extra-14-165-233-018), transparent 34%),
    linear-gradient(180deg, var(--theme-surface) 0%, var(--theme-extra-13-22-39-1) 100%);
}

.account-deletion-hero-inner {
  width: min(100%, var(--page-max-width));
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 34px var(--page-padding-x) 32px;
  text-align: center;
}

.account-deletion-hero-eyebrow {
  min-width: 76px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border: 1px solid var(--theme-primary-border);
  border-radius: 999px;
  color: var(--theme-primary-light);
  background: var(--theme-primary-softer);
  font-size: 12px;
  line-height: 1;
}

.account-deletion-hero-title {
  max-width: 100%;
  margin-top: 18px;
  font-size: 42px;
  font-weight: 900;
  line-height: 52px;
  white-space: nowrap;
  overflow-wrap: anywhere;
}

.account-deletion-hero-subtitle {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 14px;
  color: var(--theme-route-card-text, var(--theme-text-muted));
  font-size: 14px;
  line-height: 22px;
  overflow-wrap: anywhere;
}

.account-deletion-layout {
  width: min(100%, 1156px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
  padding-bottom: 84px;
}

.account-deletion-content-card {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 22px 24px 38px;
  border: 1px solid var(--theme-route-card-border, var(--theme-border-panel-soft));
  border-radius: var(--theme-route-card-radius, 15px);
  background: var(--theme-route-card-background, var(--theme-surface-soft-88));
  box-shadow: var(--theme-route-card-shadow, 0 24px 56px var(--theme-black-18));
}

.account-deletion-article {
  padding-top: 20px;
  color: var(--theme-text-muted);
}

.account-deletion-section + .account-deletion-section {
  margin-top: 34px;
}

.account-deletion-section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.account-deletion-section-icon {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--theme-primary-border-soft);
  border-radius: 10px;
  color: var(--theme-accent);
  background: var(--theme-sdk-sidebar-active-background, var(--theme-extra-14-116-144-045));
}

.account-deletion-section-icon :deep(.iconify),
.account-deletion-section-icon :deep(svg) {
  width: 17px;
  height: 17px;
}

.account-deletion-section h2 {
  margin: 0;
  color: var(--theme-route-card-title, var(--theme-white));
  font-size: 20px;
  font-weight: 800;
  line-height: 30px;
}

.account-deletion-section > p {
  margin: 0;
  color: var(--theme-route-card-text, var(--theme-text-muted));
  font-size: 14px;
  line-height: 24px;
}

.account-deletion-timeline {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.account-deletion-timeline-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px 16px;
  border: 1px solid var(--theme-primary-border-soft);
  border-radius: 12px;
  background: var(--theme-primary-softer);
}

.account-deletion-timeline-item strong {
  color: var(--theme-accent);
  font-size: 15px;
  font-weight: 800;
  line-height: 22px;
}

.account-deletion-timeline-item span {
  color: var(--theme-route-card-text, var(--theme-text-muted));
  font-size: 13px;
  line-height: 20px;
}

.account-deletion-loss-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.account-deletion-loss-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--theme-primary-border-soft);
  border-radius: 12px;
  background: var(--theme-primary-softer);
}

.account-deletion-loss-icon {
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: var(--theme-accent);
  background: var(--theme-accent-action);
}

.account-deletion-loss-icon :deep(.iconify),
.account-deletion-loss-icon :deep(svg) {
  width: 19px;
  height: 19px;
}

.account-deletion-loss-copy {
  min-width: 0;
}

.account-deletion-loss-copy h3 {
  margin: 0 0 6px;
  color: var(--theme-route-card-title, var(--theme-white));
  font-size: 16px;
  font-weight: 800;
  line-height: 24px;
}

.account-deletion-loss-copy p {
  margin: 0;
  color: var(--theme-route-card-text, var(--theme-text-muted));
  font-size: 13px;
  line-height: 22px;
}

.account-deletion-actions {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 18px 32px;
  margin-top: 22px;
  padding: 30px 32px;
  border: 1px solid rgba(28, 79, 189, 0.6);
  border-radius: var(--theme-route-card-radius, 15px);
  background: transparent;
}

.account-deletion-actions-copy {
  min-width: 0;
  flex: 1 1 320px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.account-deletion-actions-prompt {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: var(--theme-route-card-title, var(--theme-white));
  font-size: 22px;
  font-weight: 800;
  line-height: 32px;
}

.account-deletion-actions-prompt-icon {
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #16c9ec;
  background: rgba(22, 201, 236, 0.12);
}

.account-deletion-actions-prompt-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.account-deletion-actions-policy {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 10px;
  margin-top: 14px;
  color: var(--theme-text-muted);
  font-size: 13px;
  line-height: 20px;
}

.account-deletion-actions-policy a {
  color: var(--theme-text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.account-deletion-actions-policy a:hover {
  color: var(--theme-accent);
}

.account-deletion-actions-policy-divider {
  color: var(--theme-border-muted-70);
}

.account-deletion-actions-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 14px;
}

.account-deletion-action {
  min-width: 170px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 800;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.account-deletion-action-primary {
  color: var(--theme-white);
  border: 1px solid transparent;
  background: linear-gradient(90deg, #1ba0f5 0%, #1474f6 100%);
  box-shadow: 0 8px 20px rgba(20, 116, 246, 0.22);
}

.account-deletion-action-secondary {
  color: var(--theme-route-card-title, var(--theme-white));
  border: 1px solid var(--theme-primary-border-soft);
  background: var(--theme-route-card-background, var(--theme-surface-soft-88));
}

.account-deletion-action:hover {
  color: var(--theme-white);
  border-color: transparent;
  background: linear-gradient(90deg, #1ba0f5 0%, #1474f6 100%);
  box-shadow: 0 8px 20px rgba(20, 116, 246, 0.22);
  transform: translateY(-1px);
}

.account-deletion-modal .account-deletion-success-modal-icon {
  width: 72px;
  height: 72px;
  color: #ffffff;
  border-color: transparent;
  background: linear-gradient(135deg, #3c96fa 0%, #3c71f1 100%);
  box-shadow: 0 10px 26px rgba(60, 113, 241, 0.38);
}

.account-deletion-modal .account-deletion-success-modal-icon :deep(.iconify),
.account-deletion-modal .account-deletion-success-modal-icon :deep(svg) {
  width: 34px;
  height: 34px;
}

.account-deletion-success-period {
  color: #16c9ec;
  font-weight: 800;
}

.account-deletion-success-note {
  margin: 18px 0 0;
  padding: 14px 18px;
  border: 1px solid rgba(59, 130, 246, 0.28);
  border-radius: 10px;
  background: #12223a;
  color: #8290a5;
  font-size: 13px;
  line-height: 20px;
}

.account-deletion-success-actions {
  margin-top: 22px;
}

.account-deletion-success-actions .account-deletion-modal-primary {
  background: linear-gradient(90deg, #1ba0f5 0%, #1474f6 100%);
}

.account-deletion-modal.account-deletion-modal-success {
  padding-top: 38px;
  padding-bottom: 34px;
}

.account-deletion-modal.account-deletion-modal-success h2 {
  margin-top: 20px;
}

.account-deletion-modal.account-deletion-modal-success .account-deletion-modal-description {
  margin-top: 12px;
  line-height: 23px;
}

.account-deletion-modal.account-deletion-modal-success .account-deletion-success-note {
  margin-top: 24px;
  padding-top: 16px;
  padding-bottom: 16px;
}

.account-deletion-modal.account-deletion-modal-success .account-deletion-success-actions {
  margin-top: 28px;
}

.account-deletion-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  padding: 20px;
  overflow-y: auto;
  background: rgba(2, 8, 18, 0.76);
  backdrop-filter: blur(4px);
}

.account-deletion-modal {
  position: relative;
  width: min(456px, calc(100vw - 32px));
  padding: 26px 26px 24px;
  border: 1px solid #244363;
  border-radius: 14px;
  color: #f7fbff;
  background: #0b1b32;
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.46);
  text-align: center;
}

.account-deletion-modal-close {
  position: absolute;
  top: 13px;
  right: 13px;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #8493a8;
  cursor: pointer;
  transition: color 0.18s ease, background-color 0.18s ease;
}

.account-deletion-modal-close:hover,
.account-deletion-modal-close:focus-visible {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.account-deletion-modal-close :deep(svg) {
  width: 18px;
  height: 18px;
}

.account-deletion-modal-icon {
  width: 64px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 1px solid rgba(255, 113, 128, 0.28);
  border-radius: 50%;
  color: #ff7180;
  background: rgba(255, 113, 128, 0.12);
}

.account-deletion-modal-icon :deep(.iconify),
.account-deletion-modal-icon :deep(svg) {
  width: 30px;
  height: 30px;
}

.account-deletion-modal h2 {
  margin: 14px 0 0;
  color: #f8fbff;
  font-size: 22px;
  font-weight: 800;
  line-height: 30px;
}

.account-deletion-modal-description {
  margin: 8px 0 0;
  color: #8290a5;
  font-size: 13px;
  line-height: 20px;
}

.account-deletion-modal-icon-verify {
  color: #16c9ec;
  border-color: rgba(22, 201, 236, 0.28);
  background: rgba(22, 201, 236, 0.12);
}

.account-deletion-verify-input {
  width: min(360px, 100%);
  height: 46px;
  margin-top: 20px;
  padding: 0 14px;
  border: 1px solid #233b58;
  border-radius: 10px;
  color: #f7fbff;
  background: #12223a;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  text-align: left;
  outline: none;
  transition: border-color 0.18s ease;
}

.account-deletion-verify-input::placeholder {
  color: rgba(131, 144, 165, 0.7);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
}

.account-deletion-verify-input:focus {
  border-color: #16c9ec;
}

.account-deletion-verify-email-field {
  width: min(360px, 100%);
  margin: 20px auto 0;
}

.account-deletion-verify-email-wrap {
  height: 46px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  border: 1px solid #233b58;
  border-radius: 10px;
  background: #12223a;
  transition: border-color 0.18s ease;
}

.account-deletion-verify-email-wrap:focus-within {
  border-color: #16c9ec;
}

.account-deletion-verify-email-input {
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  background: none;
  color: #f7fbff;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  text-align: left;
}

.account-deletion-verify-email-input::placeholder {
  color: rgba(131, 144, 165, 0.7);
  font-weight: 400;
}

.account-deletion-verify-code-text {
  flex: 0 0 auto;
  max-width: 112px;
  padding: 0;
  border: none;
  background: none;
  color: #16c9ec;
  font-size: 13px;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: opacity 0.18s ease;
}

.account-deletion-verify-code-text:hover:not(:disabled) {
  opacity: 0.85;
}

.account-deletion-verify-code-text:disabled {
  color: #8290a5;
  cursor: not-allowed;
}

.account-deletion-verify-resend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  color: #8290a5;
  font-size: 13px;
  line-height: 20px;
}

.account-deletion-verify-resend button {
  color: #16c9ec;
  cursor: pointer;
  transition: opacity 0.18s ease;
}

.account-deletion-verify-resend button:hover:not(:disabled) {
  opacity: 0.85;
}

.account-deletion-verify-resend button:disabled {
  color: #8290a5;
  cursor: not-allowed;
}

.account-deletion-modal-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  filter: none;
  transform: none;
}

.account-deletion-modal-warnings {
  margin: 18px 0 0;
  padding: 2px 18px;
  border: 1px solid #233b58;
  border-radius: 10px;
  background: #12223a;
  list-style: none;
  text-align: left;
}

.account-deletion-modal-warnings li {
  min-height: 44px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(48, 72, 101, 0.5);
  color: #cbd7e6;
  font-size: 13px;
  line-height: 20px;
}

.account-deletion-modal-warnings li:last-child {
  border-bottom: 0;
}

.account-deletion-modal-warnings li :deep(.iconify) {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 3px;
  font-size: 16px;
  line-height: 1;
  color: #ff7180;
}

.account-deletion-modal-warnings li :deep(.iconify svg) {
  width: 16px;
  height: 16px;
  color: #ff7180;
}

.account-deletion-modal-actions {
  display: grid;
  justify-items: center;
  gap: 11px;
  margin-top: 20px;
}

.account-deletion-modal-primary {
  width: min(246px, 100%);
  height: 42px;
  border-radius: 9px;
  color: #ffffff;
  background: linear-gradient(90deg, #11b7d8 0%, #2871ed 100%);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.18s ease, transform 0.18s ease;
}

.account-deletion-modal-primary:hover,
.account-deletion-modal-primary:focus-visible {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.account-deletion-modal-secondary {
  height: 26px;
  padding: 0 10px;
  color: #8290a5;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.18s ease;
}

.account-deletion-modal-secondary:hover,
.account-deletion-modal-secondary:focus-visible {
  color: #c6d2e2;
}

:root[data-theme="light"] .account-deletion-modal {
  border-color: #cbd9e8;
  color: #13243a;
  background: #ffffff;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.22);
}

:root[data-theme="light"] .account-deletion-modal h2 {
  color: #102238;
}

:root[data-theme="light"] .account-deletion-modal-description,
:root[data-theme="light"] .account-deletion-modal-secondary {
  color: #65758a;
}

:root[data-theme="light"] .account-deletion-verify-input {
  border-color: #d9e4ef;
  color: #102238;
  background: #f4f8fc;
}

:root[data-theme="light"] .account-deletion-verify-email-wrap {
  border-color: #d9e4ef;
  background: #f4f8fc;
}

:root[data-theme="light"] .account-deletion-verify-email-input {
  color: #102238;
}

:root[data-theme="light"] .account-deletion-verify-input::placeholder {
  color: rgba(101, 117, 138, 0.7);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
}

:root[data-theme="light"] .account-deletion-verify-email-input::placeholder {
  color: rgba(101, 117, 138, 0.7);
}

:root[data-theme="light"] .account-deletion-modal-warnings {
  border-color: #d9e4ef;
  background: #f4f8fc;
}

:root[data-theme="light"] .account-deletion-modal-warnings li {
  border-color: #dfe8f1;
  color: #1d2e43;
}

@media (max-width: 900px) {
  .account-deletion-hero-section {
    display: none;
  }

  .account-deletion-layout {
    padding-top: 22px;
    padding-bottom: 44px;
  }

  .account-deletion-content-card {
    width: 100%;
    padding: 18px 16px 28px;
  }

  .account-deletion-timeline {
    grid-template-columns: 1fr;
  }

  .account-deletion-actions {
    flex-direction: column;
    align-items: stretch;
    padding: 18px 16px;
  }

  .account-deletion-actions-copy {
    flex: 1 1 auto;
    align-items: center;
    text-align: center;
  }

  .account-deletion-actions-prompt {
    justify-content: center;
  }

  .account-deletion-actions-policy {
    justify-content: center;
  }

  .account-deletion-actions-buttons {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .account-deletion-action {
    width: 100%;
  }

  .account-deletion-backdrop {
    align-items: start;
    padding: 14px 8px;
  }

  .account-deletion-modal {
    width: min(456px, calc(100vw - 16px));
    padding: 24px 18px 22px;
  }

  .account-deletion-modal-warnings {
    padding: 2px 14px;
  }

}

/* 浅色主题适配：与政策中心等页面保持一致。 */
@media (min-width: 901px) {
  :root[data-theme="light"] .account-deletion-hero-section {
    background: var(--media-images-common-light-page-hero-bg-png) center / cover no-repeat;
  }
}

:root[data-theme="light"] .account-deletion-section-icon,
:root[data-theme="light"] .account-deletion-loss-icon {
  color: var(--theme-primary);
}

:root[data-theme="light"] .account-deletion-timeline-item strong {
  color: var(--theme-primary);
}

:root[data-theme="light"] .account-deletion-action-secondary {
  color: var(--theme-route-card-title);
  border-color: var(--theme-border-muted-70);
  background: var(--theme-sdk-path-background);
}

:root[data-theme="light"] .account-deletion-success-note {
  border-color: rgba(59, 130, 246, 0.25);
  background: #f4f8fc;
  color: var(--theme-route-card-text);
}

:root[data-theme="light"] .account-deletion-actions {
  border-color: rgba(28, 79, 189, 0.25);
  background: var(--theme-route-card-background, var(--theme-surface-soft-88));
}

:root[data-theme="light"] .account-deletion-actions-prompt-icon {
  color: var(--theme-primary);
  background: var(--theme-primary-softer);
}
</style>
