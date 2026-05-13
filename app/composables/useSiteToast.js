const createToastId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

// 全局轻提示状态，页面和组件都通过这个 composable 触发提示框。
export const useSiteToast = () => {
  const toastItems = useState('site-toast-items', () => [])
  const toastText = useState('site-toast-text', () => ({
    closeToastLabel: '',
    sendCodeSuccess: '',
    sendCodeFail: '',
    passwordLoginNotReady: '',
    loginSuccess: '',
    loginFail: '',
    emailRequired: '',
    verifyCodeRequired: '',
    agreeProtocolRequired: '',
    qrcodeExpired: '',
    qrcodeIncomplete: '',
    qrcodeFetchFail: '',
    scanStatusFail: '',
    profileSaved: '',
    profileSaveFail: '',
    inviteLinkCopied: '',
  }))

  const removeToast = (id) => {
    toastItems.value = toastItems.value.filter(item => item.id !== id)
  }

  const setToastText = (text = {}) => {
    toastText.value = {
      ...toastText.value,
      closeToastLabel: text.closeToastLabel || '',
      sendCodeSuccess: text.sendCodeSuccess || '',
      sendCodeFail: text.sendCodeFail || '',
      passwordLoginNotReady: text.passwordLoginNotReady || '',
      loginSuccess: text.loginSuccess || '',
      loginFail: text.loginFail || '',
      emailRequired: text.emailRequired || '',
      verifyCodeRequired: text.verifyCodeRequired || '',
      agreeProtocolRequired: text.agreeProtocolRequired || '',
      qrcodeExpired: text.qrcodeExpired || '',
      qrcodeIncomplete: text.qrcodeIncomplete || '',
      qrcodeFetchFail: text.qrcodeFetchFail || '',
      scanStatusFail: text.scanStatusFail || '',
      profileSaved: text.profileSaved || '',
      profileSaveFail: text.profileSaveFail || '',
      inviteLinkCopied: text.inviteLinkCopied || '',
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
    }

    // 最多保留 3 条，避免连续接口提示把页面遮住。
    toastItems.value = [...toastItems.value, toast].slice(-3)

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

  return {
    toastItems,
    toastText,
    showToast,
    showSuccessToast,
    showErrorToast,
    setToastText,
    removeToast,
  }
}
