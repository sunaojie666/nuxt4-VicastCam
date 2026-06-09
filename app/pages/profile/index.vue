<template>
  <div class="profile-page-shell">
    <SiteHeader />

    <main class="profile-page-main">
      <div class="page-container profile-layout">
        <aside class="profile-sidebar" :aria-label="profileCommon.sidebarAriaLabel">
          <section class="profile-user-card">
            <div class="profile-avatar-wrap">
              <div class="profile-avatar-frame">
                <img v-if="profileAvatar" class="profile-avatar" :src="profileAvatar" :alt="profileName">
                <span v-else class="profile-avatar-placeholder" aria-hidden="true">
                  <Icon name="lucide:user-round" />
                </span>
              </div>
            </div>
            <h1>{{ profileName }}</h1>
            <p>{{ profileEmail }}</p>
            <span v-if="profileVipText" class="profile-vip-badge">
              <img class="profile-vip-badge-icon" :src="profileVipBadgeIcon" alt="">
              <span>VIP</span>
            </span>
          </section>

          <nav class="profile-menu">
            <button
              v-for="item in menuItems"
              :key="item.key"
              type="button"
              :class="['profile-menu-item', { 'profile-menu-item-active': activeTab === item.key }]"
              @click="activeTab = item.key"
            >
              <span class="profile-menu-icon">
                <Icon :name="item.icon" aria-hidden="true" />
              </span>
              <span>{{ item.label }}</span>
              <Icon name="lucide:chevron-right" aria-hidden="true" />
            </button>
          </nav>
        </aside>

        <Transition name="profile-panel-transition" mode="out-in">
          <component
            :is="activePanelComponent"
            :key="activeTab"
            v-bind="activePanelProps"
          />
        </Transition>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteFooter from '../../components/SiteFooter.vue'
import SiteHeader from '../../components/SiteHeader.vue'
import ProfileAccountPanel from './components/ProfileAccountPanel.vue'
import ProfileEarningsPanel from './components/ProfileEarningsPanel.vue'
import ProfileMembershipPanel from './components/ProfileMembershipPanel.vue'
import ProfilePurchaseHistoryPanel from './components/ProfilePurchaseHistoryPanel.vue'
import ProfileRedeemPanel from './components/ProfileRedeemPanel.vue'
import ProfileTeamPanel from './components/ProfileTeamPanel.vue'
import { setupPageSeo } from '../../utils/seo'

definePageMeta({
  middleware: 'auth',
})

const profileMenuMeta = [
  { key: 'account', field: 'account', icon: 'lucide:user-round' },
  { key: 'membership', field: 'membership', icon: 'lucide:crown' },
  { key: 'redeem', field: 'redeem', icon: 'lucide:ticket' },
  { key: 'purchaseHistory', field: 'purchaseHistory', icon: 'lucide:clipboard-list' },
  { key: 'team', field: 'team', icon: 'lucide:users-round' },
  { key: 'earnings', field: 'earnings', icon: 'lucide:coins' },
]

const profileTabComponents = {
  account: ProfileAccountPanel,
  membership: ProfileMembershipPanel,
  redeem: ProfileRedeemPanel,
  purchaseHistory: ProfilePurchaseHistoryPanel,
  team: ProfileTeamPanel,
  earnings: ProfileEarningsPanel,
}

const validProfileTabs = new Set(Object.keys(profileTabComponents))
const profileTabCookie = useCookie('profile-active-tab', { sameSite: 'lax' })
const activeTab = ref(validProfileTabs.has(profileTabCookie.value) ? profileTabCookie.value : 'account')
const { authUser, refreshVipInfo } = useAuth()
const { profileBox, loadProfileText } = useProfileText()
const { locale } = useI18n()

setupPageSeo('profile', computed(() => ({
  title: profileBox.value?.seo?.title || undefined,
  description: profileBox.value?.seo?.description || undefined,
})))

const profileCommon = computed(() => {
  return {
    sidebarAriaLabel: profileBox.value?.sidebar?.ariaLabel || '',
    defaultProfileName: profileBox.value?.common?.defaultProfileName || '',
  }
})
const menuItems = computed(() => {
  const menuText = profileBox.value?.sidebar?.menus || {}

  return profileMenuMeta.map(item => ({
    key: item.key,
    label: menuText[item.field] || '',
    icon: item.icon,
  }))
})
const activePanelComponent = computed(() => profileTabComponents[activeTab.value] || ProfileAccountPanel)
const activePanelProps = computed(() => {
  return {}
})
const profileName = computed(() => {
  return authUser.value?.nickname || authUser.value?.email || profileCommon.value.defaultProfileName
})
const profileEmail = computed(() => {
  return authUser.value?.email || ''
})
const profileAvatar = computed(() => {
  return authUser.value?.avatar || ''
})
const profileVipText = computed(() => {
  return authUser.value?.vip_type || ''
})
const profileVipBadgeIcon = computed(() => {
  const vipType = String(authUser.value?.vip_type || '').trim()
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
    return '/images/profile/gold.png'
  }

  if (
    vipTypeCode === 'Y' ||
    normalizedVipType.includes('year') ||
    normalizedVipType.includes('annual') ||
    normalizedVipType.includes('\u5e74')
  ) {
    return '/images/profile/year.png'
  }

  if (
    vipTypeCode === 'M' ||
    normalizedVipType.includes('month') ||
    normalizedVipType.includes('monthly') ||
    normalizedVipType.includes('\u6708')
  ) {
    return '/images/profile/month.png'
  }

  return '/images/profile/year.png'
})

watch(activeTab, (tab) => {
  if (!validProfileTabs.has(tab)) {
    return
  }
  profileTabCookie.value = tab
})

onMounted(() => {
  loadProfileText()
  refreshVipInfo().catch(() => null)
})

watch(locale, () => {
  loadProfileText()
})

</script>

<style scoped>
.profile-page-shell {
  --profile-page-background: var(--page-route-background);
  --profile-panel-background: var(--theme-route-card-background, var(--theme-panel));
  --profile-panel-soft: var(--theme-panel-soft);
  --profile-panel-strong: var(--theme-panel-strong);
  --profile-card-border: var(--theme-route-card-border, var(--theme-border-soft));
  --profile-card-shadow: var(--theme-profile-card-shadow, var(--theme-route-card-shadow, none));
  --profile-border: var(--theme-route-card-border, var(--theme-border-strong-86));
  --profile-text: var(--theme-text);
  --profile-muted: var(--theme-text-muted-alt);
  --profile-active: var(--theme-extra-12-77-105-1);
  --profile-cyan: var(--theme-accent);
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: clip;
  padding-top: var(--page-header-height);
  color: var(--profile-text);
  background: var(--profile-page-background);
}

.profile-page-main {
  width: 100%;
  min-height: 714px;
  flex: 1;
  padding: 80px 0 120px;
  background: var(--page-route-background);
}

.profile-layout {
  width: min(100%, 1155px);
  display: grid;
  grid-template-columns: 266px 869px;
  align-items: start;
  gap: 20px;
}

.profile-sidebar {
  display: grid;
  gap: 20px;
  min-width: 0;
}

.profile-user-card,
.profile-menu,
:deep(.profile-panel) {
  border: 1px solid var(--profile-card-border);
  border-radius: 15px;
  background: var(--profile-panel-background);
  box-shadow: var(--profile-card-shadow);
}

.profile-user-card {
  width: 266px;
  height: 225px;
  display: grid;
  justify-items: center;
  padding: 24px 18px 22px;
}

.profile-avatar-wrap {
  position: relative;
  width: 74px;
  height: 74px;
}

.profile-avatar-frame,
.profile-avatar,
.profile-avatar-placeholder {
  width: 74px;
  height: 74px;
}

.profile-avatar-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--theme-panel-soft);
  overflow: hidden;
}

.profile-avatar {
  border-radius: 12px;
  object-fit: cover;
}

.profile-avatar-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--profile-muted);
}

.profile-avatar-placeholder :deep(svg) {
  width: 30px;
  height: 30px;
}

.profile-user-card h1 {
  max-width: 100%;
  margin-top: 18px;
  color: var(--theme-profile-section-title, var(--profile-text));
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-user-card p {
  max-width: 100%;
  margin-top: 2px;
  color: var(--profile-muted);
  font-size: 14px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-vip-badge {
  min-width: 65px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 14px;
  padding: 0 10px 0 6px;
  border-radius: 999px;
  color: var(--theme-white);
  background: var(--theme-accent);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.profile-vip-badge-icon {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  object-fit: contain;
}

.profile-vip-badge span {
  line-height: 1;
}

.profile-menu {
  width: 266px;
  height: auto;
  display: grid;
  gap: 6px;
  padding: 8px;
}

.profile-menu-item {
  height: 42px;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) 16px;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  border-radius: 8px;
  color: var(--profile-muted);
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.profile-menu-item svg {
  width: 17px;
  height: 17px;
}

.profile-menu-icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--theme-profile-menu-icon-color, var(--theme-text-muted-alt));
  background: var(--theme-profile-menu-icon-background, var(--theme-panel-soft));
  transition: color 0.2s ease, background-color 0.2s ease;
}

.profile-menu-item span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-menu-item-active {
  color: var(--theme-profile-menu-active-color, var(--theme-accent));
  background: var(--theme-profile-menu-active-background, var(--theme-extra-24-54-80-1));
}

.profile-menu-item-active .profile-menu-icon {
  color: var(--theme-profile-menu-icon-active-color, var(--theme-accent));
  background: var(--theme-profile-menu-icon-active-background, var(--theme-accent-soft));
}

:deep(.profile-content) {
  display: grid;
  gap: 20px;
  width: 869px;
  min-width: 0;
}

:deep(.profile-panel) {
  width: 869px;
  min-height: 378px;
  min-width: 0;
  padding: 29px 28px;
}

:deep(.profile-panel-heading) {
  min-height: 54px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 23px;
  border-bottom: 1px solid var(--theme-profile-divider, var(--theme-border-soft));
}

:deep(.profile-panel-heading > span) {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  color: var(--profile-cyan);
  background: var(--theme-accent-soft);
}

:deep(.profile-panel-heading svg) {
  width: 18px;
  height: 18px;
}

:deep(.profile-panel-heading h2) {
  color: var(--theme-profile-section-title, var(--profile-text));
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
}

:deep(.profile-info-list) {
  display: grid;
  gap: 14px;
  margin-top: 20px;
}

:deep(.profile-info-row) {
  min-height: 66px;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;
  padding: 12px 22px;
  border: 1px solid var(--profile-border);
  border-radius: 8px;
  background: var(--profile-panel-soft);
}

:deep(.profile-info-icon) {
  width: 20px;
  height: 20px;
  font-size: 20px;
  flex: 0 0 auto;
  color: var(--profile-muted);
}

:deep(.profile-info-row div) {
  min-width: 0;
}

:deep(.profile-info-row span) {
  display: block;
  color: var(--profile-muted);
  font-size: 12px;
  line-height: 18px;
}

:deep(.profile-info-row strong) {
  display: block;
  margin-top: 2px;
  color: var(--profile-text);
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.profile-info-row button) {
  color: var(--profile-cyan);
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
}

:deep(.profile-invite-panel) {
  min-height: 236px;
  height: 236px;
  padding-bottom: 28px;
}

:deep(.profile-invite-text) {
  margin-top: 24px;
  color: var(--profile-muted);
  font-size: 14px;
  line-height: 22px;
}

:deep(.profile-invite-link) {
  min-height: 54px;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) 28px;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  padding: 0 18px;
  border: 1px solid var(--theme-profile-field-border, var(--theme-surface-soft));
  border-radius: 8px;
  color: var(--theme-profile-field-text, var(--theme-text-soft));
  background: var(--theme-profile-field-background, var(--profile-panel-strong));
}

:deep(.profile-invite-link > svg) {
  width: 17px;
  height: 17px;
  color: var(--theme-profile-field-muted, var(--profile-muted));
}

:deep(.profile-invite-link span) {
  min-width: 0;
  overflow: hidden;
  color: var(--theme-profile-field-text, var(--theme-text-soft));
  font-size: 14px;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.profile-invite-link button) {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--theme-profile-field-action, var(--profile-cyan));
  background: var(--theme-accent-action);
  cursor: pointer;
}

:deep(.profile-invite-link button svg) {
  width: 16px;
  height: 16px;
}

:deep(.profile-empty-panel) {
  display: grid;
  grid-template-rows: auto 1fr;
}

:deep(.profile-empty-state) {
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--profile-muted);
  font-size: 14px;
}

.profile-panel-transition-enter-active,
.profile-panel-transition-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.profile-panel-transition-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.profile-panel-transition-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 900px) {
  .profile-page-main {
    padding: 32px 0 56px;
  }

  .profile-layout {
    width: min(100%, var(--page-max-width));
    grid-template-columns: 1fr;
    gap: 16px;
    padding-left: 16px;
    padding-right: 16px;
  }

  .profile-sidebar {
    grid-template-columns: 1fr;
  }

  .profile-user-card,
  .profile-menu,
  :deep(.profile-content),
  :deep(.profile-panel) {
    width: 100%;
  }

  .profile-user-card,
  .profile-menu,
  :deep(.profile-panel),
  :deep(.profile-invite-panel) {
    height: auto;
  }

  :deep(.profile-panel) {
    padding: 22px 18px;
  }
}

@media (max-width: 520px) {
  .profile-user-card {
    min-height: auto;
  }

  :deep(.profile-info-row) {
    grid-template-columns: 20px minmax(0, 1fr);
    padding: 12px 14px;
  }

  :deep(.profile-info-row button) {
    grid-column: 2;
    width: fit-content;
  }

  :deep(.profile-invite-link) {
    grid-template-columns: 20px minmax(0, 1fr) 28px;
    padding: 0 12px;
  }
}
</style>
