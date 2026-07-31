const PLATFORM_DOWNLOAD_PROXY_URL = '/api/download/get-download'

const createWebsiteConfigOptions = (key = '') => {
  const trimmedKey = String(key || '').trim()

  return trimmedKey
    ? { query: { key: trimmedKey } }
    : {}
}

export const getPlatformDownload = (key = '') => {
  const options = createWebsiteConfigOptions(key)

  return $fetch(PLATFORM_DOWNLOAD_PROXY_URL, options)
}
