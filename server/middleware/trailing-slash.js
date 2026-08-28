import { getRequestURL, sendRedirect } from 'h3'

// 统一去掉页面 URL 的尾部斜杠：canonical、sitemap、hreflang 均使用无斜杠形式，
// 避免 /th 与 /th/ 同时存在造成重复内容。根路径和资源/接口路径不做处理。
export default defineEventHandler((event) => {
  const method = String(event.method || '').toUpperCase()

  if (!['GET', 'HEAD'].includes(method)) {
    return
  }

  const url = getRequestURL(event)
  const pathname = url.pathname

  if (pathname.length <= 1 || !pathname.endsWith('/')) {
    return
  }

  if (pathname.startsWith('/api/') || pathname.startsWith('/_nuxt/')) {
    return
  }

  const normalizedPath = pathname.replace(/\/+$/, '')

  return sendRedirect(event, `${normalizedPath}${url.search}`, 301)
})
