import { getHeader, getRequestURL, sendRedirect } from 'h3'

const CANONICAL_HOST = 'www.vicastcam.com'
const LEGACY_HOST = 'vicastcam.com'

export default defineEventHandler((event) => {
  const method = String(event.method || '').toUpperCase()

  if (!['GET', 'HEAD'].includes(method)) {
    return
  }

  const forwardedHost = String(getHeader(event, 'x-forwarded-host') || '').split(',')[0]
  const requestHost = forwardedHost || String(getHeader(event, 'host') || '')
  const normalizedHost = requestHost.trim().toLowerCase().replace(/:\d+$/, '')

  if (normalizedHost !== LEGACY_HOST) {
    return
  }

  const url = getRequestURL(event)

  return sendRedirect(event, `https://${CANONICAL_HOST}${url.pathname}${url.search}`, 301)
})
