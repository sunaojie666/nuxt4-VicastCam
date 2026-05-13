<template>
  <div class="profile-page-shell">
    <SiteHeader />

    <main class="profile-page-main">
      <div class="page-container profile-layout">
        <aside class="profile-sidebar" aria-label="个人中心导航">
          <section class="profile-user-card">
            <div class="profile-avatar-wrap">
              <img class="profile-avatar" :src="profileAvatar" :alt="profileName">
              <button
                type="button"
                :class="['profile-avatar-edit', { 'profile-avatar-edit-selected': avatarFile }]"
                aria-label="编辑头像"
                @click="openAvatarPicker"
              >
                <Icon name="lucide:edit-3" aria-hidden="true" />
              </button>
              <input
                ref="avatarInput"
                class="profile-avatar-input"
                type="file"
                accept="image/*"
                @change="handleAvatarChange"
              >
            </div>
            <h1>{{ profileName }}</h1>
            <p>{{ profileEmail }}</p>
            <span v-if="profileVipText" class="profile-vip-badge">{{ profileVipText }}</span>
          </section>

          <nav class="profile-menu">
            <button
              v-for="item in menuItems"
              :key="item.label"
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
            @profile-saved="handleProfileSaved"
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

definePageMeta({
  middleware: 'auth',
})

const menuItems = [
  { key: 'account', label: '账号信息', icon: 'lucide:user-round' },
  { key: 'membership', label: '会员中心', icon: 'lucide:crown' },
  { key: 'redeem', label: '兑换入口', icon: 'lucide:ticket' },
  { key: 'purchaseHistory', label: '购买记录', icon: 'lucide:clipboard-list' },
  { key: 'team', label: '我的团队', icon: 'lucide:users-round' },
  { key: 'earnings', label: '我的收益', icon: 'lucide:coins' },
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
const { authUser } = useAuth()
const avatarInput = ref(null)
const avatarFile = ref(null)
const avatarPreview = ref('')

const activePanelComponent = computed(() => profileTabComponents[activeTab.value] || ProfileAccountPanel)
const activePanelProps = computed(() => {
  if (activeTab.value !== 'account') {
    return {}
  }

  return {
    avatarFile: avatarFile.value,
  }
})
const profileName = computed(() => {
  return authUser.value?.nickname || authUser.value?.email || '个人中心'
})
const profileEmail = computed(() => {
  return authUser.value?.email || ''
})
const profileAvatar = computed(() => {
  return avatarPreview.value || authUser.value?.avatar || '/images/profile/headPortrait.png'
})
const profileVipText = computed(() => {
  return authUser.value?.vip_type || ''
})

watch(activeTab, (tab) => {
  if (!validProfileTabs.has(tab)) {
    return
  }
  profileTabCookie.value = tab
})

const clearAvatarPreview = () => {
  if (!process.client || !avatarPreview.value) {
    return
  }

  window.URL.revokeObjectURL(avatarPreview.value)
  avatarPreview.value = ''
}

const openAvatarPicker = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = (event) => {
  const file = event.target?.files?.[0] || null

  if (event.target) {
    event.target.value = ''
  }

  if (!file) {
    return
  }

  clearAvatarPreview()
  avatarFile.value = file
  avatarPreview.value = window.URL.createObjectURL(file)
}

const handleProfileSaved = () => {
  avatarFile.value = null
}

onBeforeUnmount(() => {
  clearAvatarPreview()
})

useSeoMeta({
  title: '个人中心',
  description: 'VicastCam 个人中心页面。',
})
</script>

<style scoped>
.profile-page-shell {
  --profile-page-background: var(--theme-page);
  --profile-panel-background: rgba(26, 34, 53, 1);
  --profile-panel-soft: rgba(32, 41, 61, 1);
  --profile-panel-strong: rgba(11, 18, 32, 1);
  --profile-border: rgba(55, 65, 81, 0.86);
  --profile-text: rgba(248, 250, 252, 1);
  --profile-muted: rgba(149, 156, 168, 1);
  --profile-active: rgba(12, 77, 105, 1);
  --profile-cyan: rgba(34, 211, 238, 1);
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
  background: rgba(8, 13, 24, 1);
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
  border: 1px solid rgba(37, 48, 70, 1);
  border-radius: 15px;
  background: var(--profile-panel-background);
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

.profile-avatar {
  width: 74px;
  height: 74px;
  overflow: hidden;
  border-radius: 12px;
  object-fit: cover;
}

.profile-avatar-edit {
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(55, 65, 81, 1);
  border-radius: 6px;
  color: var(--profile-muted);
  background: rgba(31, 41, 55, 1);
  cursor: pointer;
}

.profile-avatar-edit-selected {
  color: rgba(34, 211, 238, 1);
  border-color: rgba(34, 211, 238, 0.65);
}

.profile-avatar-input {
  display: none;
}

.profile-avatar-edit svg {
  width: 12px;
  height: 12px;
}

.profile-user-card h1 {
  max-width: 100%;
  margin-top: 18px;
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
  min-width: 66px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 14px;
  padding: 0 14px;
  border-radius: 999px;
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(90deg, rgba(34, 211, 238, 1), rgba(59, 130, 246, 1));
  font-size: 14px;
  font-weight: 700;
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
  color: rgba(149, 156, 168, 1);
  background: rgba(32, 41, 61, 1);
  transition: color 0.2s ease, background-color 0.2s ease;
}

.profile-menu-item span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-menu-item-active {
  color: rgba(34, 211, 238, 1);
  background: rgba(24, 54, 80, 1);
}

.profile-menu-item-active .profile-menu-icon {
  color: rgba(34, 211, 238, 1);
  background: rgba(34, 211, 238, 0.14);
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
  border-bottom: 1px solid rgba(37, 48, 70, 1);
}

:deep(.profile-panel-heading > span) {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  color: var(--profile-cyan);
  background: rgba(34, 211, 238, 0.14);
}

:deep(.profile-panel-heading svg) {
  width: 18px;
  height: 18px;
}

:deep(.profile-panel-heading h2) {
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
  border: 1px solid rgba(30, 41, 59, 1);
  border-radius: 8px;
  color: rgba(229, 231, 235, 1);
  background: var(--profile-panel-strong);
}

:deep(.profile-invite-link > svg) {
  width: 17px;
  height: 17px;
  color: var(--profile-muted);
}

:deep(.profile-invite-link span) {
  min-width: 0;
  overflow: hidden;
  color: rgba(229, 231, 235, 1);
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
  color: var(--profile-cyan);
  background: rgba(34, 211, 238, 0.16);
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
