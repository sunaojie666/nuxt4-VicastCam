<template>
  <section class="profile-content" aria-label="账号信息">
    <section class="profile-panel profile-invite-panel">
      <header class="profile-panel-heading">
        <span>
          <Icon name="lucide:link" aria-hidden="true" />
        </span>
        <h2>邀请链接</h2>
      </header>

      <p class="profile-invite-text">分享你的专属邀请链接，好友通过链接加入后会自动绑定到你的团队。</p>

      <div class="profile-invite-link">
        <Icon name="lucide:link-2" aria-hidden="true" />
        <span>{{ inviteLink || '暂无邀请链接' }}</span>
        <button
          type="button"
          aria-label="复制邀请链接"
          :disabled="!inviteLink"
          @click="copyInviteLink"
        >
          <Icon name="lucide:copy" aria-hidden="true" />
        </button>
      </div>
    </section>

    <section class="profile-panel account-profile-panel">
      <header class="profile-panel-heading">
        <span>
          <Icon name="lucide:user-round" aria-hidden="true" />
        </span>
        <h2>个人资料</h2>
      </header>

      <form class="account-form" @submit.prevent="handleSaveProfile">
        <div class="account-form-grid">
          <label class="account-field">
            <span>昵称</span>
            <input v-model.trim="profileForm.nickname" type="text" placeholder="请输入昵称">
          </label>

          <label class="account-field">
            <span>职业</span>
            <input v-model.trim="profileForm.industry" type="text" placeholder="请输入职业">
          </label>

          <div class="account-field">
            <span>性别</span>
            <div class="account-gender-group">
              <button
                v-for="option in genderOptions"
                :key="option"
                type="button"
                :class="['account-gender-option', { 'account-gender-option-active': profileForm.gender === option }]"
                @click="profileForm.gender = option"
              >
                {{ option }}
              </button>
            </div>
          </div>

          <label class="account-field">
            <span>地区</span>
            <input v-model.trim="profileForm.region" type="text" placeholder="请输入地区">
          </label>

          <label class="account-field account-field-full">
            <span>个人简介</span>
            <span class="account-textarea-wrap">
              <textarea
                v-model.trim="profileForm.intro"
                maxlength="120"
                placeholder="请输入简介"
              ></textarea>
              <span>{{ profileForm.intro.length }}/120个字符</span>
            </span>
          </label>

          <label class="account-field">
            <span>手机号</span>
            <input v-model.trim="profileForm.mobile" type="tel" placeholder="请输入手机号">
          </label>

          <label class="account-field">
            <span>邮箱</span>
            <input v-model.trim="profileForm.email" type="email" placeholder="请输入邮箱地址">
          </label>

          <label class="account-field account-field-full">
            <span>新密码</span>
            <span class="account-password-wrap">
              <input
                v-model="profileForm.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="至少8位，包含字母与数字"
              >
              <button type="button" aria-label="切换密码可见性" @click="showPassword = !showPassword">
                <Icon :name="showPassword ? 'lucide:eye' : 'lucide:eye-off'" aria-hidden="true" />
              </button>
            </span>
          </label>
        </div>

        <footer class="account-form-footer">
          <p>修改后请点击右侧「保存」按钮使资料生效</p>
          <button type="submit" :disabled="isSaving">保存修改</button>
        </footer>
      </form>
    </section>
  </section>
</template>

<script setup>
const props = defineProps({
  avatarFile: {
    type: null,
    default: null,
  },
})
const emit = defineEmits(['profile-saved'])
const { authUser, updateUserProfile } = useAuth()
const { toastText, showSuccessToast, showErrorToast } = useSiteToast()
const genderOptions = ['男', '女', '保密']
const showPassword = ref(false)
const isSaving = ref(false)

const profileForm = reactive({
  nickname: authUser.value?.nickname || '',
  industry: '',
  gender: '保密',
  region: '',
  intro: '',
  mobile: '',
  email: authUser.value?.email || '',
  password: '',
})

const normalizeGender = (value) => {
  const gender = String(value || '').trim().toLowerCase()

  if (gender === '男' || gender === 'male' || gender === 'm' || gender === '1') {
    return '男'
  }

  if (gender === '女' || gender === 'female' || gender === 'f' || gender === '2') {
    return '女'
  }

  return '保密'
}

const syncProfileForm = (user = {}) => {
  profileForm.nickname = user.nickname || ''
  profileForm.industry = user.industry || ''
  profileForm.gender = normalizeGender(user.gender)
  profileForm.region = user.region || user.area || [user.province, user.city].filter(Boolean).join(' ')
  profileForm.intro = user.intro || ''
  profileForm.mobile = user.mobile || ''
  profileForm.email = user.email || ''
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
    () => showSuccessToast(toastText.value.inviteLinkCopied || ''),
    () => null
  )
}

const createProfilePayload = () => {
  return {
    user_id: authUser.value?.user_id || '',
    nickname: profileForm.nickname,
    intro: profileForm.intro,
    industry: profileForm.industry,
    gender: profileForm.gender,
    area: profileForm.region,
    password: profileForm.password,
    avatar: props.avatarFile,
    mobile: profileForm.mobile,
    email: profileForm.email,
  }
}

const handleSaveProfile = () => {
  if (isSaving.value) {
    return
  }

  isSaving.value = true

  updateUserProfile(createProfilePayload()).then(
    () => {
      emit('profile-saved')
      showSuccessToast(toastText.value.profileSaved || '')
      isSaving.value = false
    },
    () => {
      showErrorToast(toastText.value.profileSaveFail || '')
      isSaving.value = false
    }
  )
}

watch(authUser, user => {
  syncProfileForm(user || {})
}, {
  immediate: true,
})
</script>

<style scoped>
.account-profile-panel {
  min-height: 502px !important;
  padding: 28px 28px 27px !important;
}

.profile-invite-link button:disabled {
  opacity: 0.48;
  cursor: not-allowed;
}

.account-profile-panel .profile-panel-heading {
  min-height: 52px;
  padding-bottom: 21px;
}

.account-form {
  margin-top: 18px;
}

.account-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 20px;
}

.account-field {
  min-width: 0;
  display: grid;
  gap: 8px;
}

.account-field-full {
  grid-column: 1 / -1;
}

.account-field > span:first-child {
  color: rgba(149, 156, 168, 1);
  font-size: 12px;
  line-height: 18px;
}

.account-field input,
.account-field textarea,
.account-password-wrap {
  width: 100%;
  border: 1px solid rgba(82, 101, 129, 1);
  border-radius: 7px;
  color: rgba(229, 238, 252, 1);
  background: rgba(14, 24, 40, 1);
  font-size: 14px;
  line-height: 20px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.account-field input {
  height: 38px;
  padding: 0 14px;
}

.account-field textarea {
  height: 67px;
  display: block;
  padding: 11px 14px 22px;
  resize: none;
}

.account-field input::placeholder,
.account-field textarea::placeholder {
  color: rgba(122, 136, 159, 1);
}

.account-field input:focus,
.account-field textarea:focus,
.account-password-wrap:focus-within {
  border-color: rgba(34, 211, 238, 0.9);
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.12);
  background: rgba(12, 22, 38, 1);
}

.account-gender-group {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.account-gender-option {
  height: 38px;
  border: 1px solid rgba(13, 22, 37, 1);
  border-radius: 7px;
  color: rgba(149, 156, 168, 1);
  background: rgba(11, 19, 34, 1);
  font-size: 13px;
  line-height: 18px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.account-gender-option-active {
  border-color: rgba(46, 104, 255, 1);
  color: rgba(34, 211, 238, 1);
  background: rgba(22, 49, 88, 1);
  box-shadow: inset 0 0 0 1px rgba(34, 211, 238, 0.45);
}

.account-textarea-wrap {
  position: relative;
  display: block;
}

.account-textarea-wrap > span {
  position: absolute;
  right: 12px;
  bottom: 6px;
  color: rgba(132, 145, 168, 1);
  font-size: 10px;
  line-height: 14px;
  pointer-events: none;
}

.account-password-wrap {
  height: 38px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 34px;
  align-items: center;
}

.account-password-wrap input {
  height: 36px;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.account-password-wrap input:focus {
  box-shadow: none;
}

.account-password-wrap button {
  height: 36px;
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

.account-form-footer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 136px;
  align-items: center;
  gap: 20px;
  margin-top: 18px;
}

.account-form-footer p {
  min-width: 0;
  color: rgba(149, 156, 168, 1);
  font-size: 12px;
  line-height: 18px;
  overflow-wrap: anywhere;
}

.account-form-footer button {
  height: 28px;
  border-radius: 7px;
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(90deg, rgba(59, 178, 233, 1), rgba(47, 125, 235, 1));
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.2s ease;
}

.account-form-footer button:disabled {
  opacity: 0.58;
  cursor: not-allowed;
  transform: none;
}

.account-form-footer button:hover,
.account-form-footer button:focus {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.account-form-footer button:disabled:hover,
.account-form-footer button:disabled:focus {
  filter: none;
  transform: none;
}

@media (max-width: 900px) {
  .account-profile-panel {
    min-height: 0 !important;
  }
}

@media (max-width: 640px) {
  .account-form-grid,
  .account-form-footer {
    grid-template-columns: 1fr;
  }

  .account-form-footer button {
    width: 100%;
    height: 38px;
  }
}
</style>
