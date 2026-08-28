import { getAccountDeletions } from '../api/request/strapi'

// 空结构仅用于保证模板安全，文案完全来自 Strapi 的 deletions 接口。
const createEmptyAccountDeletionCopy = () => ({
  page: {
    eyebrow: '',
    titleMain: '',
    titleHighlight: '',
    subtitle: '',
    breadcrumbRoot: '',
    breadcrumbCurrent: '',
    breadcrumbAriaLabel: '',
    policyLinksAriaLabel: '',
    closeLabel: '',
  },
  sections: {
    legalRights: { title: '', text: '' },
    deletionData: { title: '', text: '' },
    lostServices: { title: '', items: [] },
    retention: { title: '', text: '' },
  },
  timeline: [],
  policyLinks: [],
  actions: {
    thinkAgain: '',
    submit: '',
    confirmPrompt: '是否确定要注销您的账号？',
  },
  confirm: {
    title: '',
    description: '',
    warnings: [],
    submit: '',
  },
  verify: {
    title: '',
    description: '',
    emailPlaceholder: '',
    codePlaceholder: '',
    getCode: '',
    resendPrefix: '',
    resend: '',
    sending: '',
    verifying: '',
    submit: '',
    back: '',
  },
  success: {
    title: '',
    descriptionPrefix: '',
    coolingPeriodLabel: '',
    descriptionSuffix: '',
    note: '',
    confirm: '',
  },
  cooling: {
    title: '',
    description: '',
    endTimeLabel: '',
    revoke: '',
    revoking: '',
    continue: '',
  },
  toasts: {
    emailRequired: '',
    emailInvalid: '',
    codeRequired: '',
    loginExpired: '',
    sendFailed: '',
    verifyFailed: '',
    userMissing: '',
    revokeFailed: '',
    loginFailed: '',
    cancelSuccess: '账号注销成功',
  },
  seo: {
    title: '',
    description: '',
  },
})

const isPlainObject = value => value && typeof value === 'object' && !Array.isArray(value)

const mergeCopy = (base, extra) => {
  if (!isPlainObject(extra)) {
    return base
  }

  const result = { ...base }

  for (const [key, value] of Object.entries(extra)) {
    if (value === undefined || value === null || value === '') {
      continue
    }

    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = mergeCopy(result[key], value)
    } else {
      result[key] = value
    }
  }

  return result
}

const getAccountDeletionAttributes = (response) => {
  const firstRecord = Array.isArray(response?.data) ? response.data[0] : response?.data
  const record = firstRecord?.attributes || firstRecord?.data || firstRecord || {}

  return record
}

// 账号注销文案：页面和登录页冷静期弹窗共用，Strapi 未配置时回退中文。
export const useAccountDeletionCopy = () => {
  const { locale } = useI18n()
  const loadedLocale = useState('account-deletion-copy-locale', () => '')
  const fallbackCopy = useState('account-deletion-copy-fallback', createEmptyAccountDeletionCopy)
  const remoteCopy = useState('account-deletion-copy-remote', () => ({}))
  const copy = computed(() => mergeCopy(fallbackCopy.value, remoteCopy.value))

  useLocalizedAsyncState({
    locale,
    loadedLocale,
    load: currentLocale => getAccountDeletions(currentLocale).catch(() => null),
    sync: (response) => {
      remoteCopy.value = getAccountDeletionAttributes(response)
    },
    reset: () => {
      remoteCopy.value = {}
    },
  })

  return {
    copy,
  }
}
