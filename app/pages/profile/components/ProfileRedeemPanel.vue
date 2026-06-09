<template>
  <section class="profile-content" :aria-label="redeemText.ariaLabel">
    <section class="profile-panel membership-activation-panel">
      <header class="profile-panel-heading">
        <span class="membership-heading-icon">
          <Icon name="lucide:ticket" aria-hidden="true" />
        </span>
        <h2>{{ redeemText.title }}</h2>
      </header>

      <p class="membership-activation-tip">{{ redeemText.tip }}</p>

      <div class="membership-activation-row">
        <input
          v-model="cardPwd"
          type="text"
          class="membership-activation-input"
          :placeholder="redeemText.placeholder"
          :disabled="isActivating"
          @keyup.enter="handleActiveCard"
        >
        <button
          type="button"
          class="membership-activation-button"
          :disabled="isActivating"
          @click="handleActiveCard"
        >
          {{ redeemText.submitButton }}
        </button>
      </div>

      <p class="membership-activation-agreement">
        {{ redeemText.agreementPrefix }}
        <a href="javascript:void(0)">《{{ redeemText.userProtocolText }}》</a>
      </p>
    </section>
  </section>
</template>

<script setup>
import { activeCard } from '../../../api/request/auth'

const cardPwd = ref('')
const isActivating = ref(false)
const { authUser, refreshVipInfo } = useAuth()
const { showErrorToast, showRequestFailToast, showRequestSuccessToast, showSuccessToast } = useSiteToast()
const { profileBox } = useProfileText()
const profileText = computed(() => profileBox.value || {})
const redeemText = computed(() => profileBox.value?.redeem || {})
const successResponseCodes = new Set([0, 200, 200001, 200200])

const pickResponseValue = (...values) => {
  return values.find(value => value !== undefined && value !== null && value !== '')
}

const getResponseCode = (response) => {
  const code = pickResponseValue(
    response?.code,
    response?.data?.code,
    response?.data?.data?.code,
    response?.raw?.code,
    response?.raw?.data?.code,
    response?.data?.raw?.code,
    response?.data?.raw?.data?.code
  )

  return code === undefined ? '' : String(code)
}

const getResponseMessage = (response) => {
  return String(pickResponseValue(
    response?.message,
    response?.error?.message,
    response?.data?.message,
    response?.data?.error?.message,
    response?.data?.data?.message,
    response?.raw?.message,
    response?.raw?.data?.message,
    response?.data?.raw?.message,
    response?.data?.raw?.data?.message
  ) || '').trim()
}

const normalizeCardErrorMessages = (errors = {}) => {
  if (Array.isArray(errors)) {
    return errors.reduce((messages, error) => {
      const code = getResponseCode(error)
      const message = String(pickResponseValue(error?.message, error?.text, error?.label) || '').trim()

      if (code && message) {
        messages[code] = message
      }

      return messages
    }, {})
  }

  if (!errors || typeof errors !== 'object') {
    return {}
  }

  return Object.entries(errors).reduce((messages, [code, message]) => {
    const text = String(message || '').trim()

    if (code && text) {
      messages[String(code)] = text
    }

    return messages
  }, {})
}

const activeCardErrorMessages = computed(() => ({
  ...normalizeCardErrorMessages(profileText.value.cardErrors),
}))

const isSuccessResponse = (response) => {
  const code = getResponseCode(response)
  const numericCode = Number(code)
  const status = String(response?.status ?? response?.data?.status ?? '').toLowerCase()

  if (code && Number.isFinite(numericCode) && !successResponseCodes.has(numericCode)) {
    return false
  }

  if (status && !['success', 'ok', 'succeed'].includes(status)) {
    return false
  }

  return !response?.error && !response?.data?.error
}

const getActiveCardErrorMessage = (response) => {
  const code = getResponseCode(response)

  return String(
    activeCardErrorMessages.value[code] ||
    getResponseMessage(response) ||
    redeemText.value.errors?.activateFail ||
    ''
  ).trim()
}

const getActiveCardSuccessMessage = () => {
  return String(profileText.value.successMessage || '').trim()
}

const handleActiveCard = () => {
  const card_pwd = cardPwd.value.trim()

  if (!card_pwd || isActivating.value) {
    return
  }

  isActivating.value = true

  activeCard({
    user_id: authUser.value?.user_id,
    card_pwd,
  }).then((response) => {
    if (!isSuccessResponse(response)) {
      return Promise.reject(Object.assign(new Error(getActiveCardErrorMessage(response)), {
        data: response,
      }))
    }

    cardPwd.value = ''
    const successMessage = getActiveCardSuccessMessage()

    if (successMessage) {
      showSuccessToast(successMessage)
    } else {
      showRequestSuccessToast()
    }

    refreshVipInfo().catch(() => null)
    return response
  }).catch((error) => {
    const message = getActiveCardErrorMessage(error?.data || error)

    if (message) {
      showErrorToast(message)
      return
    }

    showRequestFailToast()
  }).finally(() => {
    isActivating.value = false
  })
}
</script>

<style scoped>
.membership-activation-panel {
  width: 869px;
  min-height: 0 !important;
  height: 277px;
  padding-top: 0 !important;
  padding-bottom: 0;
}

.membership-activation-panel .profile-panel-heading {
  height: 81px;
  min-height: 81px;
  padding-bottom: 0;
}

.membership-heading-icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--theme-accent);
  background: var(--theme-accent-soft);
}

.membership-activation-tip {
  margin-top: 20px;
  color: var(--theme-profile-field-muted, var(--theme-extra-132-148-173-1));
  font-size: 14px;
  line-height: 20px;
}

.membership-activation-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 183px;
  gap: 14px;
  margin-top: 20px;
}

.membership-activation-input {
  height: 60px;
  padding: 0 14px;
  border: 1px solid var(--theme-profile-field-border, var(--theme-extra-35-47-75-1));
  border-radius: 8px;
  color: var(--theme-profile-field-text, var(--theme-text-title));
  background: var(--theme-profile-field-background, var(--theme-extra-8-19-39-1));
  font-size: 14px;
}

.membership-activation-input::placeholder {
  color: var(--theme-profile-field-placeholder, var(--theme-text-subtle-alt));
}

.membership-activation-input:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

.membership-activation-button {
  height: 60px;
  border-radius: 8px;
  color: var(--theme-extra-235-246-255-1);
  background: var(--theme-profile-field-action, linear-gradient(90deg, var(--theme-extra-64-184-239-1), var(--theme-extra-56-118-233-1)));
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.membership-activation-button:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

.membership-activation-agreement {
  margin-top: 20px;
  color: var(--theme-profile-field-muted, var(--theme-extra-97-113-140-1));
  font-size: 12px;
  line-height: 18px;
}

.membership-activation-agreement a {
  color: var(--theme-profile-field-action, var(--theme-accent));
}

@media (max-width: 900px) {
  .membership-activation-panel {
    width: 100%;
    height: auto;
    min-height: 0 !important;
  }

  .membership-activation-row {
    grid-template-columns: 1fr;
  }

  .membership-activation-button {
    width: 100%;
  }
}
</style>
