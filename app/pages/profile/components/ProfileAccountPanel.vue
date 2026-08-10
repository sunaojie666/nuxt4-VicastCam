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
            <strong>{{ currentVipName }}</strong>
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
const mediaUrl = useMediaUrl()
const { authUser } = useAuth()
const { showRequestSuccessToast } = useSiteToast()
const { profileBox } = useProfileText()

const commonText = computed(() => profileBox.value?.common || {})
const accountText = computed(() => profileBox.value?.account || {})
const membershipText = computed(() => profileBox.value?.membership || {})
const profileName = computed(() => {
  return authUser.value?.nickname || accountText.value.defaultUsername || ''
})

const resolveVipBadgeImage = (value) => {
  const vipType = String(value || '').trim()
  const normalizedVipType = vipType.toLowerCase()
  const vipTypeCode = vipType.toUpperCase()

  if (
    vipTypeCode === 'L' ||
    normalizedVipType.includes('life') ||
    normalizedVipType.includes('lifetime') ||
    normalizedVipType.includes('permanent') ||
    normalizedVipType.includes('\u7ec8\u8eab') ||
    normalizedVipType.includes('\u6c38\u4e45')
  ) {
    return mediaUrl('/images/profile/gold.png')
  }

  if (
    vipTypeCode === 'Y' ||
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
}
</style>
