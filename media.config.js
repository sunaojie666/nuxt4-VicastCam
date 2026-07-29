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

  return `${normalizeMediaBaseUrl(baseUrl)}${normalizedPath}`
}
