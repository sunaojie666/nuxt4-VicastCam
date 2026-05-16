<template>
  <div class="auth-scan-panel">
    <div class="auth-scan-code">
      <span v-if="isLoadingQrcode" class="auth-scan-placeholder">{{ requestLoadingText }}</span>

      <button
        v-else-if="qrcodeLoadFailed"
        type="button"
        class="auth-scan-retry"
        @click="loadLoginQrcode"
      >
        <Icon name="lucide:refresh-cw" aria-hidden="true" />
        <span>重新获取</span>
      </button>

      <img v-else-if="qrcodeSource" :src="qrcodeSource" alt="VicastCam APP扫码登录二维码">

      <span v-else class="auth-scan-placeholder">暂无二维码</span>
    </div>

    <p class="auth-scan-tip">
      <img src="/images/scanCode.png" alt="" aria-hidden="true">
      <span>{{ loginBox.qrLoginTip }}</span>
    </p>

    <p v-if="qrcodeSource && scanStatusText" class="auth-scan-status">{{ scanStatusText }}</p>

    <p class="auth-scan-agreement">
      {{ agreementPrefix }}
      <a v-if="loginBox.userProtocolText" href="#">《{{ loginBox.userProtocolText }}》</a>
      <template v-if="loginBox.userProtocolText && loginBox.privacyPolicyText">和</template>
      <a v-if="loginBox.privacyPolicyText" href="#">《{{ loginBox.privacyPolicyText }}》</a>
    </p>
  </div>
</template>

<script setup>
import { getLoginQrcode } from '../../../api/request/auth'

const props = defineProps({
  loginBox: {
    type: Object,
    default: () => ({}),
  },
  toastBox: {
    type: Object,
    default: () => ({}),
  },
})
const { requestLoadingText, showErrorToast, showRequestFailToast, showRequestSuccessToast } = useSiteToast()
const { loginWithScanQrcode } = useAuth()
const localePath = useLocalePath()
const qrcodeSource = ref('')
const qrcodeUuid = ref('')
const qrcodeLoadFailed = ref(false)
const isLoadingQrcode = ref(false)
const isCheckingScanStatus = ref(false)
const scanStatusText = ref('')
let scanStatusTimer = null
let scanStatusCount = 0

const SCAN_STATUS_INTERVAL = 2000
const SCAN_STATUS_MAX_COUNT = 90
const loginBox = computed(() => props.loginBox || {})
const toastBox = computed(() => props.toastBox || {})
const agreementPrefix = computed(() => {
  return String(loginBox.value.agreeProtocolText || '')
    .replace(loginBox.value.userProtocolText || '', '')
    .replace(loginBox.value.privacyPolicyText || '', '')
    .replace('和', '')
    .trim()
})

const qrcodeSourceKeys = [
  'qrcode',
  'qr_code',
  'qrcode_url',
  'qrcodeUrl',
  'url',
  'image',
  'img',
  'base64',
]

const qrcodeUuidKeys = [
  'uuid',
  'qr_uuid',
  'qrcode_uuid',
  'qrcodeUuid',
]

const isPlainRecord = (value) => {
  return value && typeof value === 'object'
}

const isReadableValue = (value) => {
  return ['string', 'number'].includes(typeof value) && String(value).trim()
}

const findValueByKeys = (payload, keys, depth = 0) => {
  if (!isPlainRecord(payload) || depth > 4) {
    return ''
  }

  for (const key of keys) {
    const value = payload[key]

    if (isReadableValue(value)) {
      return value
    }

    if (isPlainRecord(value)) {
      const nestedValue = findValueByKeys(value, keys, depth + 1)

      if (nestedValue) {
        return nestedValue
      }
    }
  }

  for (const value of Object.values(payload)) {
    const nestedValue = findValueByKeys(value, keys, depth + 1)

    if (nestedValue) {
      return nestedValue
    }
  }

  return ''
}

const normalizeQrcodeSource = (value) => {
  const source = String(value || '').trim()

  if (!source) {
    return ''
  }

  if (source.startsWith('http') || source.startsWith('/') || source.startsWith('data:image')) {
    return source
  }

  return `data:image/png;base64,${source}`
}

const findQrcodeSource = (response) => {
  const source = findValueByKeys(response, qrcodeSourceKeys)
  const fallbackSource = isReadableValue(response?.data) ? response.data : ''

  return normalizeQrcodeSource(source || fallbackSource || (isReadableValue(response) ? response : ''))
}

const findQrcodeUuid = (response) => {
  return String(findValueByKeys(response, qrcodeUuidKeys) || '').trim()
}

const clearScanStatusTimer = () => {
  if (scanStatusTimer) {
    window.clearInterval(scanStatusTimer)
    scanStatusTimer = null
  }
}

const stopScanStatusPolling = () => {
  clearScanStatusTimer()
  isCheckingScanStatus.value = false
}

const expireQrcode = () => {
  stopScanStatusPolling()
  qrcodeLoadFailed.value = true
  qrcodeSource.value = ''
  qrcodeUuid.value = ''
  scanStatusText.value = ''
  showErrorToast(toastBox.value.qrcodeExpired || '')
}

const handleScanLoginSuccess = () => {
  stopScanStatusPolling()
  showRequestSuccessToast()
  navigateTo(localePath('/'))
}

const checkScanLoginStatus = () => {
  if (isCheckingScanStatus.value || !qrcodeUuid.value) {
    return
  }

  scanStatusCount += 1

  if (scanStatusCount > SCAN_STATUS_MAX_COUNT) {
    expireQrcode()
    return
  }

  isCheckingScanStatus.value = true

  loginWithScanQrcode(qrcodeUuid.value).then(
    result => {
      isCheckingScanStatus.value = false

      if (result?.user) {
        handleScanLoginSuccess()
      }
    },
    () => {
      stopScanStatusPolling()
      qrcodeLoadFailed.value = true
      showRequestFailToast()
    }
  )
}

const startScanStatusPolling = () => {
  clearScanStatusTimer()
  scanStatusCount = 0
  scanStatusText.value = loginBox.value.qrWaitingTip || ''
  scanStatusTimer = window.setInterval(checkScanLoginStatus, SCAN_STATUS_INTERVAL)
  checkScanLoginStatus()
}

const loadLoginQrcode = () => {
  stopScanStatusPolling()
  isLoadingQrcode.value = true
  qrcodeLoadFailed.value = false
  qrcodeSource.value = ''
  qrcodeUuid.value = ''
  scanStatusText.value = ''

  getLoginQrcode().then(
    response => {
      const source = findQrcodeSource(response)
      const uuid = findQrcodeUuid(response)

      isLoadingQrcode.value = false

      if (!source || !uuid) {
        qrcodeLoadFailed.value = true
        showRequestFailToast()
        return
      }

      qrcodeSource.value = source
      qrcodeUuid.value = uuid
      startScanStatusPolling()
    },
    () => {
      isLoadingQrcode.value = false
      qrcodeLoadFailed.value = true
      showRequestFailToast()
    }
  )
}

onMounted(() => {
  loadLoginQrcode()
})

onBeforeUnmount(() => {
  stopScanStatusPolling()
})
</script>

<style scoped>
.auth-scan-panel {
  display: grid;
  justify-items: center;
  margin-top: 82px;
}

.auth-scan-code {
  width: 222px;
  height: 222px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 1);
}

.auth-scan-code img {
  width: 191px;
  height: 191px;
  object-fit: contain;
}

.auth-scan-placeholder,
.auth-scan-retry {
  width: 191px;
  height: 191px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(17, 24, 39, 1);
  font-size: 14px;
  line-height: 20px;
  text-align: center;
}

.auth-scan-retry {
  gap: 8px;
  cursor: pointer;
}

.auth-scan-retry svg {
  width: 16px;
  height: 16px;
}

.auth-scan-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  max-width: 100%;
  margin-top: 17px;
  color: rgba(149, 156, 168, 1);
  font-size: 14px;
  line-height: 20px;
  overflow-wrap: anywhere;
}

.auth-scan-tip img {
  width: 19px;
  height: 19px;
  flex: 0 0 auto;
  object-fit: contain;
}

.auth-scan-tip strong {
  color: rgba(34, 211, 238, 1);
  font-weight: 400;
}

.auth-scan-status {
  max-width: 100%;
  margin-top: 10px;
  color: rgba(148, 163, 184, 1);
  font-size: 13px;
  line-height: 18px;
  text-align: center;
  overflow-wrap: anywhere;
}

.auth-scan-agreement {
  max-width: 100%;
  margin-top: 44px;
  color: rgba(149, 156, 168, 1);
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  overflow-wrap: anywhere;
}

.auth-scan-agreement a {
  color: rgba(34, 211, 238, 1);
}

@media (max-width: 520px) {
  .auth-scan-panel {
    margin-top: 58px;
  }

  .auth-scan-agreement {
    margin-top: 52px;
  }
}
</style>
