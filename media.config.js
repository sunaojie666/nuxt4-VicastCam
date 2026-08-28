export const defaultMediaUrl = 'https://cdn.vicastcam.com/vicastcam-website-media'

export const normalizeMediaBaseUrl = (url = defaultMediaUrl) => {
  return String(url || defaultMediaUrl).replace(/\/+$/, '')
}

export const createMediaUrl = (path = '', baseUrl = defaultMediaUrl) => {
  const url = String(path || '').trim()

  if (!url) {
    return ''
  }

  if (/^(?:https?:)?\/\//i.test(url) || /^(?:data|blob):/i.test(url)) {
    return url
  }

  const normalizedPath = url.startsWith('/') ? url : `/${url}`
  const base = normalizeMediaBaseUrl(baseUrl)

  // 本地开发默认直接使用 public 目录下的资源（避免新资源未同步到 CDN 时本地 404），
  // 仅当媒体地址仍为默认 CDN 时生效；通过 NUXT_PUBLIC_MEDIA_URL 显式指定地址则仍使用该地址。
  if (base === normalizeMediaBaseUrl(defaultMediaUrl) && process.env.NODE_ENV === 'development') {
    return normalizedPath
  }

  return `${base}${normalizedPath}`
}
