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
              <input
                v-if="editingField === 'nickname'"
                ref="nicknameInput"
                v-model.trim="profileForm.nickname"
                type="text"
                autocomplete="name"
                :placeholder="accountText.usernamePlaceholder"
              >
              <strong v-else>{{ profileName }}</strong>
            </span>
            <button
              type="button"
              class="account-row-action"
              :disabled="isSaving"
              @click="handleFieldAction('nickname')"
            >
              {{ editingField === 'nickname' ? commonText.confirmButton : commonText.editButton }}
            </button>
          </div>

          <div class="account-info-row">
            <Icon class="account-info-icon" name="lucide:lock-keyhole" aria-hidden="true" />
            <span class="account-info-main">
              <span>{{ accountText.passwordLabel }}</span>
              <span v-if="editingField === 'password'" class="account-password-wrap">
                <input
                  ref="passwordInput"
                  v-model="profileForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  :placeholder="accountText.passwordPlaceholder"
                >
                <button type="button" :aria-label="commonText.togglePasswordLabel" @click="showPassword = !showPassword">
                  <Icon :name="showPassword ? 'lucide:eye' : 'lucide:eye-off'" aria-hidden="true" />
                </button>
              </span>
              <strong v-else>{{ accountText.passwordMask }}</strong>
            </span>
            <button
              type="button"
              class="account-row-action"
              :disabled="isSaving"
              @click="handleFieldAction('password')"
            >
              {{ editingField === 'password' ? commonText.confirmButton : commonText.editButton }}
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
const emit = defineEmits(['profile-saved'])
const { authUser, updateUserProfile } = useAuth()
const { showErrorToast, showRequestFailToast, showRequestSuccessToast } = useSiteToast()
const { profileBox } = useProfileText()
const showPassword = ref(false)
const isSaving = ref(false)
const editingField = ref('')
const nicknameInput = ref(null)
const passwordInput = ref(null)

const profileForm = reactive({
  nickname: authUser.value?.nickname || '',
  password: '',
})

const commonText = computed(() => profileBox.value?.common || {})
const accountText = computed(() => profileBox.value?.account || {})
const profileName = computed(() => {
  return authUser.value?.nickname || accountText.value.defaultUsername || ''
})

const syncProfileForm = (user = {}) => {
  profileForm.nickname = user.nickname || ''
}

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

const createProfilePayload = (field) => {
  if (field === 'nickname') {
    return {
      nickname: profileForm.nickname,
    }
  }

  if (field === 'password') {
    return {
      password: profileForm.password,
    }
  }

  return {}
}

const saveProfileField = (field) => {
  if (isSaving.value) {
    return
  }

  isSaving.value = true

  updateUserProfile(createProfilePayload(field)).then(
    () => {
      emit('profile-saved')
      if (field === 'password') {
        profileForm.password = ''
        showPassword.value = false
      }
      editingField.value = ''
      showRequestSuccessToast()
      isSaving.value = false
    },
    () => {
      showRequestFailToast()
      isSaving.value = false
    }
  )
}

const focusEditingField = (field) => {
  nextTick(() => {
    const target = field === 'nickname' ? nicknameInput.value : passwordInput.value

    target?.focus()
  })
}

const handleFieldAction = (field) => {
  if (editingField.value !== field) {
    editingField.value = field

    if (field === 'nickname') {
      profileForm.nickname = authUser.value?.nickname || ''
    }

    if (field === 'password') {
      profileForm.password = ''
      showPassword.value = false
    }

    focusEditingField(field)
    return
  }

  if (field === 'nickname' && !profileForm.nickname.trim()) {
    showErrorToast(accountText.value.errors?.usernameRequired || '')
    return
  }

  if (field === 'password' && !profileForm.password.trim()) {
    showErrorToast(accountText.value.errors?.passwordRequired || '')
    return
  }

  saveProfileField(field)
}

watch(authUser, user => {
  syncProfileForm(user || {})
}, {
  immediate: true,
})
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
  grid-template-columns: 20px minmax(0, 1fr) 52px;
  align-items: center;
  gap: 16px;
  min-height: 50px;
  padding: 8px 14px;
  border: 1px solid rgba(55, 65, 81, 0.86);
  border-radius: 8px;
  background: rgba(32, 41, 61, 1);
}

.account-info-icon {
  width: 17px;
  height: 17px;
  color: rgba(149, 156, 168, 1);
}

.account-info-main {
  min-width: 0;
  display: grid;
  gap: 5px;
}

.account-info-main > span:first-child {
  color: rgba(149, 156, 168, 1);
  font-size: 12px;
  line-height: 16px;
}

.account-info-main input {
  width: 100%;
  min-width: 0;
  color: rgba(236, 244, 255, 1);
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
}

.account-info-main input::placeholder {
  color: rgba(120, 136, 162, 1);
  font-weight: 400;
}

.account-info-main strong {
  display: block;
  min-width: 0;
  color: rgba(236, 244, 255, 1);
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-password-wrap {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 34px;
  align-items: center;
}

.account-password-wrap input {
  padding-right: 8px;
}

.account-password-wrap button {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(149, 156, 168, 1);
  cursor: pointer;
}

.account-password-wrap svg {
  width: 15px;
  height: 15px;
}

.account-row-action {
  justify-self: end;
  color: rgba(34, 211, 238, 1);
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
}

.account-row-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

  .account-row-action {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
