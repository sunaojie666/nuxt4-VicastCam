<template>
  <section class="profile-content" :aria-label="accountText.ariaLabel">
    <section class="profile-panel account-profile-panel">
      <header class="profile-panel-heading">
        <span>
          <Icon name="lucide:user-round" aria-hidden="true" />
        </span>
        <h2>{{ accountText.profileTitle }}</h2>
      </header>

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
        <button
          type="button"
          :aria-label="commonText.copyButtonLabel"
          :disabled="!inviteLink"
          @click="copyInviteLink"
        >
          <Icon name="lucide:copy" aria-hidden="true" />
        </button>
      </div>
    </section>
  </section>
</template>

<script setup>
const { authUser } = useAuth()
const { showRequestSuccessToast } = useSiteToast()
const { profileBox } = useProfileText()

const commonText = computed(() => profileBox.value?.common || {})
const accountText = computed(() => profileBox.value?.account || {})
const profileName = computed(() => {
  return authUser.value?.nickname || accountText.value.defaultUsername || ''
})

const inviteLink = computed(() => {
  if (authUser.value?.invite_link) {
    return authUser.value.invite_link
  }

  if (!process.client || !authUser.value?.invite_code) {
    return ''
  }

  return `${window.location.origin}/?inviteCode=${encodeURIComponent(authUser.value.invite_code)}`
})

const copyInviteLink = () => {
  if (!process.client || !inviteLink.value || !window.navigator?.clipboard) {
    return
  }

  window.navigator.clipboard.writeText(inviteLink.value).then(
    () => showRequestSuccessToast(),
    () => null
  )
}
</script>

<style scoped>
.account-profile-panel {
  min-height: 0 !important;
  height: auto !important;
  padding-top: 0 !important;
  padding-bottom: 20px !important;
}

.profile-invite-link button:disabled {
  opacity: 0.48;
  cursor: not-allowed;
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

@media (max-width: 900px) {
  .account-profile-panel {
    min-height: 0 !important;
  }
}

@media (max-width: 640px) {
  .account-info-row {
    grid-template-columns: 20px minmax(0, 1fr);
  }
}
</style>
