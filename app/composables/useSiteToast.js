import { getApiResponseMessage } from '../utils/api-response'

const createToastId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

// 全局轻提示状态，页面和组件都通过这个 composable 触发提示框。
export const useSiteToast = () => {
  const nuxtApp = useNuxtApp()
  const toastItems = useState('site-toast-items', () => [])
  const toastText = useState('site-toast-text', () => ({
    closeToastLabel: '',
    requestLoading: '',
    requestSuccess: '',
    requestFail: '',
    passwordLoginNotReady: '',
    emailRequired: '',
    verifyCodeRequired: '',
    agreeProtocolRequired: '',
    qrcodeExpired: '',
    apiResponseMessages: {},
  }))

  const removeToast = (id) => {
    const targetToast = toastItems.value.find(item => item.id === id)

    if (!targetToast) {
      return
    }

    toastItems.value = toastItems.value.map(item => {
      return item.id === id ? { ...item, visible: false, leaving: true } : item
    })

    if (process.client) {
      window.setTimeout(() => {
        toastItems.value = toastItems.value.filter(item => item.id !== id)
      }, 360)
    } else {
      toastItems.value = toastItems.value.filter(item => item.id !== id)
    }
  }

  const setToastText = (text = {}) => {
    toastText.value = {
      ...toastText.value,
      closeToastLabel: text.closeToastLabel || '',
      requestLoading: text.requestLoading || '',
      requestSuccess: text.requestSuccess || '',
      requestFail: text.requestFail || '',
      passwordLoginNotReady: text.passwordLoginNotReady || '',
      emailRequired: text.emailRequired || '',
      verifyCodeRequired: text.verifyCodeRequired || '',
      agreeProtocolRequired: text.agreeProtocolRequired || '',
      qrcodeExpired: text.qrcodeExpired || '',
      apiResponseMessages: text.apiResponseMessages || text.responseMessages || text.responseCodes || {},
    }
  }

  const showToast = ({ message = '', type = 'info', duration = 2600 } = {}) => {
    const toastMessage = String(message || '').trim()

    if (!toastMessage) {
      return null
    }

    const toast = {
      id: createToastId(),
      message: toastMessage,
      type,
      duration,
      visible: false,
      leaving: false,
    }

    // 最多保留 3 条，避免连续接口提示把页面遮住。
    toastItems.value = [...toastItems.value, toast].slice(-3)

    if (process.client) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          toastItems.value = toastItems.value.map(item => {
            return item.id === toast.id ? { ...item, visible: true } : item
          })
        })
      })
    }

    if (process.client && duration > 0) {
      window.setTimeout(() => {
        removeToast(toast.id)
      }, duration)
    }

    return toast.id
  }

  const showSuccessToast = (message, options = {}) => {
    return showToast({
      ...options,
      message,
      type: 'success',
    })
  }

  const showErrorToast = (message, options = {}) => {
    return showToast({
      ...options,
      message,
      type: 'error',
    })
  }

  const showRequestSuccessToast = (options = {}) => {
    return showSuccessToast(toastText.value.requestSuccess, options)
  }

  const showRequestFailToast = (options = {}) => {
    return showErrorToast(toastText.value.requestFail, options)
  }

  const resolveApiResponseMessage = (payload, options = {}) => {
    const i18nLocale = nuxtApp.$i18n?.locale
    const locale = typeof i18nLocale === 'string' ? i18nLocale : i18nLocale?.value

    return getApiResponseMessage(payload, {
      locale: locale || 'en',
      scope: options.scope || payload?.responseScope || 'general',
      messages: options.messages || toastText.value.apiResponseMessages,
      fallback: options.fallback || toastText.value.requestFail,
    })
  }

  const showApiResponseSuccessToast = (payload, options = {}) => {
    const message = resolveApiResponseMessage(payload, {
      ...options,
      fallback: options.fallback || toastText.value.requestSuccess,
    })

    return showSuccessToast(message, options)
  }

  const showApiResponseErrorToast = (payload, options = {}) => {
    if (payload?.authExpiredHandled) {
      return null
    }

    return showErrorToast(resolveApiResponseMessage(payload, options), options)
  }

  const requestLoadingText = computed(() => {
    const text = String(toastText.value.requestLoading || '').trim()

    if (!text) {
      return ''
    }

    return text.endsWith('...') ? text : `${text}...`
  })

  return {
    toastItems,
    toastText,
    requestLoadingText,
    showToast,
    showSuccessToast,
    showErrorToast,
    showRequestSuccessToast,
    showRequestFailToast,
    showApiResponseSuccessToast,
    showApiResponseErrorToast,
    resolveApiResponseMessage,
    setToastText,
    removeToast,
  }
}
