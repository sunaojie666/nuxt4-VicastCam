<template>
  <section class="profile-content" :aria-label="accountText.ariaLabel">
    <section class="profile-panel account-profile-panel">
      <header class="profile-panel-heading">
        <span>
          <Icon name="lucide:user-round" aria-hidden="true" />
        </span>
        <h2>{{ accountText.profileTitle }}</h2>
      </header>

      <article class="account-membership-current">
        <div class="account-membership-current-main">
          <img class="account-membership-current-badge" :src="currentMembershipBadgeImage" :alt="membershipText.badgeAlt">
          <div class="account-membership-current-copy">
            <div class="account-membership-current-title">
              <strong>{{ currentVipName }}</strong>
              <MembershipTypeTag v-if="authUser?.vip_type" :vip-type="authUser.vip_type" />
            </div>
            <p>
              <Icon name="lucide:calendar" aria-hidden="true" />
              {{ currentVipExpireText }}
            </p>
          </div>
        </div>
        <span class="account-membership-current-status">{{ currentVipStatusText }}</span>
      </article>

      <div class="account-form">
        <div class="account-info-list">
          <div class="account-info-row">
            <Icon class="account-info-icon" name="lucide:user-round" aria-hidden="true" />
            <span class="account-info-main">
              <span>{{ accountText.usernameLabel }}</span>
              <strong>{{ profileName }}</strong>
            </span>
          </div>

          <div class="account-info-row">
            <Icon class="account-info-icon" name="lucide:lock-keyhole" aria-hidden="true" />
            <span class="account-info-main">
              <span>{{ accountText.passwordLabel }}</span>
              <strong>{{ accountText.passwordMask }}</strong>
            </span>
          </div>

          <div
            id="profile-account-email"
            class="account-info-row account-email-row"
            :class="{ 'account-email-row--bound': hasBoundEmail }"
          >
            <Icon class="account-info-icon" name="lucide:mail" aria-hidden="true" />
            <span class="account-info-main">
              <span>{{ accountText.emailLabel }}</span>
              <strong v-if="hasBoundEmail">{{ boundEmail }}</strong>
              <span v-else class="account-email-bind-box">
                <span class="account-email-input-row">
                  <input
                    v-model.trim="emailAddress"
                    type="email"
                    autocomplete="email"
                    :placeholder="accountText.emailPlaceholder"
                    :disabled="isEmailLocked || isSendingCode || codeCountdown > 0"
                    @keyup.enter="handleBindEmail"
                  >
                  <button
                    type="button"
                    class="account-email-code-button"
                    :disabled="isEmailLocked || isSendingCode || codeCountdown > 0"
                    @click="handleSendEmailCode"
                  >
                    {{ codeButtonText }}
                  </button>
                </span>
                <span class="account-email-input-row">
                  <input
                    v-model.trim="verificationCode"
                    type="text"
                    inputmode="numeric"
                    autocomplete="one-time-code"
                    :placeholder="accountText.codePlaceholder"
                    :disabled="isEmailLocked || isBindingEmail || !hasRequestedEmailCode"
                    @keyup.enter="handleBindEmail"
                  >
                  <button
                    type="button"
                    class="account-email-bind-button"
                    :disabled="isEmailLocked || isBindingEmail || !hasRequestedEmailCode"
                    @click="handleBindEmail"
                  >
                    {{ accountText.bindButton }}
                  </button>
                </span>
                <small>{{ accountText.emailBindTip }}</small>
              </span>
            </span>
            <button
              v-if="hasBoundEmail"
              type="button"
              class="account-email-bound-button"
              disabled
            >
              {{ accountText.alreadyBound }}
            </button>
          </div>
        </div>

      </div>
    </section>

    <section class="profile-panel profile-invite-panel">
      <header class="profile-panel-heading">
        <span>
          <Icon name="lucide:link" aria-hidden="true" />
        </span>
        <h2>{{ accountText.inviteTitle }}</h2>
      </header>

      <p class="profile-invite-text">{{ accountText.inviteDescription }}</p>

      <div class="profile-invite-link">
        <Icon name="lucide:external-link" aria-hidden="true" />
        <span>{{ inviteLink || accountText.emptyInviteLink }}</span>
      </div>
    </section>
  </section>
</template>

<script setup>
import { sendEmailCode } from '../../../api/request/auth'

const mediaUrl = useMediaUrl()
const { authUser, bindUserEmail } = useAuth()
const {
  showApiResponseSuccessToast,
  showApiResponseErrorToast,
  showErrorToast,
} = useSiteToast()
const { profileBox } = useProfileText()

const commonText = computed(() => profileBox.value?.common || {})
const accountText = computed(() => profileBox.value?.account || {})
const membershipText = computed(() => profileBox.value?.membership || {})
const profileName = computed(() => {
  return authUser.value?.nickname || accountText.value.defaultUsername || ''
})

const emailAddress = ref('')
const verificationCode = ref('')
const isSendingCode = ref(false)
const isBindingEmail = ref(false)
const hasRequestedEmailCode = ref(false)
const requestedEmailAddress = ref('')
const codeCountdown = ref(0)
let codeCountdownTimer = null

const boundEmail = computed(() => String(authUser.value?.email || '').trim())
const hasBoundEmail = computed(() => Boolean(boundEmail.value))
const isEmailLocked = computed(() => hasBoundEmail.value)
const codeButtonText = computed(() => {
  if (codeCountdown.value > 0) {
    return `${codeCountdown.value}s`
  }

  return accountText.value.sendCodeButton || ''
})

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const startCodeCountdown = () => {
  if (!process.client) {
    return
  }

  if (codeCountdownTimer) {
    window.clearInterval(codeCountdownTimer)
  }

  codeCountdown.value = 120
  codeCountdownTimer = window.setInterval(() => {
    codeCountdown.value -= 1

    if (codeCountdown.value <= 0) {
      window.clearInterval(codeCountdownTimer)
      codeCountdownTimer = null
      codeCountdown.value = 0
    }
  }, 1000)
}

const handleSendEmailCode = () => {
  if (isEmailLocked.value || isSendingCode.value || codeCountdown.value > 0) {
    return
  }

  const email = emailAddress.value.trim()

  if (!isValidEmail(email)) {
    showErrorToast(accountText.value.emailRequired)
    return
  }

  isSendingCode.value = true

  sendEmailCode(email, 'bindEmail').then(
    (response) => {
      showApiResponseSuccessToast(response, {
        scope: 'auth',
        fallback: accountText.value.codeSent,
      })
      requestedEmailAddress.value = email
      hasRequestedEmailCode.value = true
      startCodeCountdown()
    },
    (error) => {
      showApiResponseErrorToast(error, {
        scope: 'auth',
        fallback: accountText.value.requestFailed,
      })
    }
  ).finally(() => {
    isSendingCode.value = false
  })
}

const handleBindEmail = () => {
  if (isEmailLocked.value || isBindingEmail.value) {
    return
  }

  const email = emailAddress.value.trim()
  const captcha = verificationCode.value.trim()

  if (!hasRequestedEmailCode.value) {
    showErrorToast(accountText.value.codeRequired)
    return
  }

  if (email !== requestedEmailAddress.value) {
    showErrorToast(accountText.value.emailChanged || accountText.value.codeRequired)
    return
  }

  if (!isValidEmail(email)) {
    showErrorToast(accountText.value.emailRequired)
    return
  }

  if (!captcha) {
    showErrorToast(accountText.value.codeRequired)
    return
  }

  if (!authUser.value?.user_id) {
    showErrorToast(accountText.value.userMissing || commonText.value.userMissing)
    return
  }

  isBindingEmail.value = true

  bindUserEmail({
    user_id: authUser.value.user_id,
    email,
    captcha,
  }).then(
    (response) => {
      emailAddress.value = ''
      verificationCode.value = ''
      showApiResponseSuccessToast(response, {
        scope: 'auth',
        fallback: accountText.value.bindSuccess,
      })
    },
    (error) => {
      showApiResponseErrorToast(error, {
        scope: 'auth',
        fallback: accountText.value.bindFailed,
      })
    }
  ).finally(() => {
    isBindingEmail.value = false
  })
}

onBeforeUnmount(() => {
  if (codeCountdownTimer) {
    window.clearInterval(codeCountdownTimer)
  }
})

watch(emailAddress, (value) => {
  if (
    hasRequestedEmailCode.value &&
    String(value || '').trim() !== requestedEmailAddress.value
  ) {
    hasRequestedEmailCode.value = false
    requestedEmailAddress.value = ''
    verificationCode.value = ''
  }
})

const resolveVipBadgeImage = (value) => {
  const vipType = String(value || '').trim()
  const normalizedVipType = vipType.toLowerCase()
  const vipTypeCode = vipType.toUpperCase()

  if (
    vipTypeCode === 'Y' ||
    normalizedVipType.includes('life') ||
    normalizedVipType.includes('lifetime') ||
    normalizedVipType.includes('permanent') ||
    normalizedVipType.includes('\u7ec8\u8eab') ||
    normalizedVipType.includes('\u6c38\u4e45')
  ) {
    return mediaUrl('/images/profile/gold.png')
  }

  if (
    vipTypeCode === 'N' ||
    normalizedVipType.includes('year') ||
    normalizedVipType.includes('annual') ||
    normalizedVipType.includes('\u5e74')
  ) {
    return mediaUrl('/images/profile/year.png')
  }

  if (
    vipTypeCode === 'M' ||
    normalizedVipType.includes('month') ||
    normalizedVipType.includes('monthly') ||
    normalizedVipType.includes('\u6708')
  ) {
    return mediaUrl('/images/profile/month.png')
  }

  return mediaUrl('/images/profile/year.png')
}

const currentVipName = computed(() => {
  return authUser.value?.vip_type
    ? membershipText.value.activeVipName || membershipText.value.vipName || ''
    : membershipText.value.defaultVipName || ''
})

const currentVipExpireText = computed(() => {
  return authUser.value?.vip_endtime
    ? `${membershipText.value.expirePrefix || ''} ${authUser.value.vip_endtime}`.trim()
    : `${membershipText.value.expirePrefix || ''} ${membershipText.value.emptyExpireDate || ''}`.trim()
})

const currentVipStatusText = computed(() => {
  return authUser.value?.vip_type
    ? membershipText.value.activeStatus || ''
    : membershipText.value.inactiveStatus || ''
})

const currentMembershipBadgeImage = computed(() => {
  return resolveVipBadgeImage(authUser.value?.vip_type)
})

const inviteLink = computed(() => {
  return authUser.value?.invite_link || ''
})
</script>

<style scoped>
.account-profile-panel {
  min-height: 0 !important;
  height: auto !important;
  padding-top: 0 !important;
  padding-bottom: 20px !important;
}

.profile-invite-panel {
  min-height: 0 !important;
  height: auto !important;
  padding-bottom: 20px !important;
}

.account-profile-panel .profile-panel-heading {
  min-height: 58px;
  padding-bottom: 0;
}

.account-form {
  margin-top: 14px;
}

.account-membership-current {
  width: 100%;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 18px;
  padding: 0 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, var(--theme-extra-47-166-221-1), var(--theme-extra-49-128-235-1));
}

.account-membership-current-main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.account-membership-current-badge {
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  object-fit: contain;
}

.account-membership-current-copy {
  min-width: 0;
}

.account-membership-current-title {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.account-membership-current strong {
  display: block;
  color: var(--theme-white);
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
}

.account-membership-current p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  color: var(--theme-extra-223-239-255-1);
  font-size: 13px;
  line-height: 19px;
}

.account-membership-current p svg {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
}

.account-membership-current-status {
  height: 34px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--theme-extra-111-187-255-07);
  border-radius: 999px;
  color: var(--theme-extra-218-239-255-1);
  background: var(--theme-extra-31-113-226-1);
  font-size: 13px;
  font-weight: 600;
  flex: 0 0 auto;
}

.account-info-list {
  display: grid;
  gap: 14px;
}

.account-info-row {
  min-width: 0;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  min-height: 50px;
  padding: 8px 14px;
  border: 1px solid var(--theme-profile-field-border, var(--theme-border-strong-86));
  border-radius: 8px;
  background: var(--theme-profile-field-background, var(--theme-panel-soft));
}

.account-info-icon {
  width: 17px;
  height: 17px;
  color: var(--theme-profile-field-muted, var(--theme-text-muted-alt));
}

.account-info-main {
  min-width: 0;
  display: grid;
  gap: 5px;
}

.account-info-main > span:first-child {
  color: var(--theme-profile-field-muted, var(--theme-text-muted-alt));
  font-size: 12px;
  line-height: 16px;
}

.account-info-main strong {
  display: block;
  min-width: 0;
  color: var(--theme-profile-field-text, var(--theme-text-strong));
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-email-row {
  align-items: start;
}

.account-email-row--bound {
  grid-template-columns: 20px minmax(0, 1fr) auto;
  align-items: center;
}

.account-email-row .account-info-main {
  width: 100%;
}

.account-email-bind-box {
  display: grid !important;
  gap: 8px;
  margin-top: 2px;
}

.account-email-bound-button {
  min-width: 68px;
  height: 30px;
  padding: 0 10px;
  border-radius: 6px;
  color: var(--theme-profile-field-muted, var(--theme-text-muted-alt));
  background: var(--theme-panel-soft);
  font-size: 12px;
  cursor: not-allowed;
}

.account-email-input-row {
  min-width: 0;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
}

.account-email-input-row input {
  width: 100%;
  min-width: 0;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--theme-profile-field-border, var(--theme-border-strong-86));
  border-radius: 6px;
  color: var(--theme-profile-field-text, var(--theme-text-strong));
  background: var(--theme-profile-field-background, var(--theme-panel-soft));
  font-size: 13px;
  outline: none;
}

.account-email-input-row input:focus {
  border-color: var(--theme-profile-field-action, var(--theme-accent));
}

.account-email-input-row input:disabled {
  opacity: 0.68;
  cursor: not-allowed;
}

.account-email-input-row input::placeholder {
  color: var(--theme-profile-field-placeholder, var(--theme-text-muted-alt));
}

.account-email-code-button,
.account-email-bind-button {
  min-width: 96px;
  height: 36px;
  padding: 0 12px;
  border-radius: 6px;
  color: var(--theme-profile-field-action, var(--theme-accent));
  background: var(--theme-accent-action);
  font-size: 13px;
  cursor: pointer;
}

.account-email-bind-button {
  color: var(--theme-white);
  background: var(--theme-profile-field-action, var(--theme-accent));
}

.account-email-code-button:disabled,
.account-email-bind-button:disabled {
  opacity: 0.48;
  cursor: not-allowed;
}

.account-email-bind-box small {
  color: var(--theme-profile-field-muted, var(--theme-text-muted-alt));
  font-size: 12px;
  line-height: 18px;
}

@media (max-width: 900px) {
  .account-profile-panel {
    min-height: 0 !important;
  }

  .account-membership-current {
    min-height: 92px;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    padding: 12px 16px;
  }
}

@media (max-width: 640px) {
  .account-info-row {
    grid-template-columns: 20px minmax(0, 1fr);
  }

  .account-email-input-row {
    grid-template-columns: 1fr;
  }

  .account-email-code-button,
  .account-email-bind-button,
  .account-email-bound-button {
    width: 100%;
  }

  .account-email-row--bound {
    grid-template-columns: 20px minmax(0, 1fr);
    align-items: start;
  }

  .account-email-row--bound .account-email-bound-button {
    grid-column: 2;
  }
}
</style>
