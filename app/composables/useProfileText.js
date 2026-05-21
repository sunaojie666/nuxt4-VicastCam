import { getProfiles } from '../api/request/strapi'

const getProfileContentData = (response) => {
  if (Array.isArray(response?.data)) {
    const firstItem = response.data[0] || {}

    return firstItem.attributes || firstItem
  }

  return response?.data?.attributes || response?.data || response || {}
}

const getProfileBoxData = (profileData = {}) => {
  const jsonData = profileData.data || profileData.profileData || profileData.profile_data || profileData

  return jsonData.profileBox || jsonData.profile_box || jsonData || {}
}

export const useProfileText = () => {
  const { locale } = useI18n()
  const profileBox = useState('profile-box', () => ({}))
  const isProfileTextLoading = useState('profile-box-loading', () => false)
  const profileBoxLocale = useState('profile-box-locale', () => '')

  const syncProfileText = (profileData = {}) => {
    profileBox.value = getProfileBoxData(profileData)
  }

  const loadProfileText = () => {
    if (profileBoxLocale.value === locale.value && Object.keys(profileBox.value || {}).length) {
      return Promise.resolve(profileBox.value)
    }

    isProfileTextLoading.value = true

    return getProfiles(locale.value).then(
      response => {
        syncProfileText(getProfileContentData(response))
        profileBoxLocale.value = locale.value
        isProfileTextLoading.value = false
        return profileBox.value
      },
      () => {
        syncProfileText()
        profileBoxLocale.value = locale.value
        isProfileTextLoading.value = false
        return profileBox.value
      }
    )
  }

  return {
    profileBox,
    isProfileTextLoading,
    loadProfileText,
  }
}
