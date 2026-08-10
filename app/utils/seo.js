import { computed, unref, useHead, useI18n, useLocaleHead, useRoute, useRuntimeConfig, useSeoMeta } from '#imports'
import { defaultDescription, defaultRobots, defaultSeoImage, getPageSeoCopy } from './seo-copy'

const siteName = 'VicastCam'
const defaultSiteUrl = 'https://www.vicastcam.com'

const isNoindexRobots = (robots = '') => {
  return String(robots).toLowerCase().split(/[,\s]+/).includes('noindex')
}

const createOgLocale = (language = '') => {
  return String(language || '').replace('-', '_')
}

const normalizePath = (path = '/') => {
  const urlPath = String(path || '/').split('?')[0].split('#')[0]
  const normalizedPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`
  const withoutTrailingSlash = normalizedPath.length > 1 ? normalizedPath.replace(/\/+$/, '') : normalizedPath

  return withoutTrailingSlash || '/'
}

const getLocaleCode = locale => typeof locale === 'string' ? locale : locale?.code

const getLocaleLanguage = locale => {
  if (typeof locale === 'string') {
    return locale
  }

  return locale?.language || locale?.code || ''
}

const removeLocalePrefix = (path, localeCodes = []) => {
  const normalizedPath = normalizePath(path)
  const segments = normalizedPath.split('/').filter(Boolean)

  if (!segments.length || !localeCodes.includes(segments[0])) {
    return normalizedPath
  }

  const baseSegments = segments.slice(1)

  return baseSegments.length ? `/${baseSegments.join('/')}` : '/'
}

const normalizeStructuredDataEntries = (value) => {
  const normalizedValue = unref(value)
  const entries = Array.isArray(normalizedValue) ? normalizedValue : [normalizedValue]

  return entries.filter(entry => entry && typeof entry === 'object')
}

export const createAbsoluteUrl = (path, siteUrl = defaultSiteUrl) => {
  const url = String(path || '').trim()

  if (!url) {
    return ''
  }

  if (/^(?:https?:)?\/\//i.test(url) || /^(?:data|blob):/i.test(url)) {
    return url
  }

  const normalizedSiteUrl = String(siteUrl || defaultSiteUrl).replace(/\/+$/, '')
  const normalizedPath = url.startsWith('/') ? url : `/${url}`

  return `${normalizedSiteUrl}${normalizedPath}`
}

export const createLocalizedPath = (path = '/', localeCode = '', defaultLocale = 'en') => {
  const normalizedPath = normalizePath(path)

  if (!localeCode || localeCode === defaultLocale) {
    return normalizedPath
  }

  return normalizePath(`/${localeCode}${normalizedPath === '/' ? '' : normalizedPath}`)
}

export const createLocalizedUrl = (path = '/', localeCode = '', siteUrl = defaultSiteUrl, defaultLocale = 'en') => {
  return createAbsoluteUrl(createLocalizedPath(path, localeCode, defaultLocale), siteUrl)
}

export const setupPageSeo = (pageKey, options = {}) => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const { locale, locales } = useI18n()
  const localeHead = useLocaleHead({
    seo: {
      canonicalQueries: [],
    },
  })

  const activeLocaleConfig = computed(() => {
    return locales.value.find(item => typeof item !== 'string' && item.code === locale.value) || {}
  })

  const pageSeo = computed(() => {
    const normalizedPageKey = unref(pageKey)
    const optionValues = typeof options === 'function' ? options() : unref(options)
    const inheritCopy = optionValues?.inheritCopy !== false
    const normalizedOptions = Object.fromEntries(
      Object.entries(optionValues || {}).filter(([key, value]) => key !== 'inheritCopy' && value !== undefined && value !== null && value !== '')
    )
    const seoCopy = inheritCopy ? getPageSeoCopy(normalizedPageKey, locale.value) : {}

    return {
      siteName,
      description: inheritCopy ? defaultDescription : '',
      robots: defaultRobots,
      imageAlt: siteName,
      ...seoCopy,
      ...normalizedOptions,
    }
  })

  const shouldIndexPage = computed(() => !isNoindexRobots(pageSeo.value.robots))
  const siteUrl = computed(() => String(config.public.siteUrl || defaultSiteUrl).replace(/\/+$/, ''))
  const defaultLocale = computed(() => config.public.i18n?.defaultLocale || 'en')
  const localeCodes = computed(() => locales.value.map(getLocaleCode).filter(Boolean))
  const routeBasePath = computed(() => removeLocalePrefix(route.path, localeCodes.value))
  const pageCanonicalUrl = computed(() => {
    return createLocalizedUrl(routeBasePath.value, locale.value, siteUrl.value, defaultLocale.value)
  })
  const localeAlternateLinks = computed(() => {
    const links = locales.value
      .map(item => ({
        code: getLocaleCode(item),
        language: getLocaleLanguage(item),
      }))
      .filter(item => item.code && item.language)
      .map(item => ({
        key: `alternate-${item.language}`,
        rel: 'alternate',
        hreflang: item.language,
        href: createLocalizedUrl(routeBasePath.value, item.code, siteUrl.value, defaultLocale.value),
      }))

    links.push({
      key: 'alternate-x-default',
      rel: 'alternate',
      hreflang: 'x-default',
      href: createLocalizedUrl(routeBasePath.value, defaultLocale.value, siteUrl.value, defaultLocale.value),
    })

    return links
  })
  const pageSeoImage = computed(() => {
    return createAbsoluteUrl(pageSeo.value.image || defaultSeoImage, siteUrl.value)
  })
  const ogLocale = computed(() => {
    return createOgLocale(activeLocaleConfig.value.language || locale.value)
  })
  const ogLocaleAlternates = computed(() => {
    return locales.value
      .filter(item => typeof item !== 'string' && item.code !== locale.value)
      .map(item => createOgLocale(item.language || item.code))
      .filter(Boolean)
  })

  useHead(() => ({
    meta: [
      ...(shouldIndexPage.value ? (localeHead.value.meta || []) : []),
      ...(shouldIndexPage.value
        ? ogLocaleAlternates.value.map(language => ({
            property: 'og:locale:alternate',
            content: language,
          }))
        : []),
    ],
    link: shouldIndexPage.value
      ? [
          { key: 'canonical', rel: 'canonical', href: pageCanonicalUrl.value },
          ...localeAlternateLinks.value,
        ]
      : [],
    htmlAttrs: {
      ...localeHead.value.htmlAttrs,
      dir: activeLocaleConfig.value.dir || 'ltr',
    },
  }))

  useSeoMeta({
    title: () => pageSeo.value.title,
    description: () => pageSeo.value.description,
    robots: () => pageSeo.value.robots,
    ogTitle: () => shouldIndexPage.value ? pageSeo.value.title : undefined,
    ogDescription: () => shouldIndexPage.value ? pageSeo.value.description : undefined,
    ogType: () => shouldIndexPage.value ? 'website' : undefined,
    ogSiteName: () => shouldIndexPage.value ? pageSeo.value.siteName : undefined,
    ogLocale: () => shouldIndexPage.value ? ogLocale.value : undefined,
    ogUrl: () => shouldIndexPage.value ? pageCanonicalUrl.value : undefined,
    ogImage: () => shouldIndexPage.value ? pageSeoImage.value : undefined,
    ogImageAlt: () => shouldIndexPage.value ? (pageSeo.value.imageAlt || pageSeo.value.title || pageSeo.value.siteName) : undefined,
    twitterCard: () => shouldIndexPage.value ? 'summary_large_image' : undefined,
    twitterSite: () => shouldIndexPage.value ? pageSeo.value.twitterSite : undefined,
    twitterCreator: () => shouldIndexPage.value ? pageSeo.value.twitterCreator : undefined,
    twitterTitle: () => shouldIndexPage.value ? pageSeo.value.title : undefined,
    twitterDescription: () => shouldIndexPage.value ? pageSeo.value.description : undefined,
    twitterImage: () => shouldIndexPage.value ? pageSeoImage.value : undefined,
    twitterImageAlt: () => shouldIndexPage.value ? (pageSeo.value.imageAlt || pageSeo.value.title || pageSeo.value.siteName) : undefined,
  })
}

export const setupStructuredData = (schema, options = {}) => {
  const scriptId = options.id || 'page-jsonld'

  useHead(() => {
    const entries = normalizeStructuredDataEntries(typeof schema === 'function' ? schema() : schema)

    return {
      script: entries.map((entry, index) => ({
        id: entries.length > 1 ? `${scriptId}-${index + 1}` : scriptId,
        type: 'application/ld+json',
        textContent: JSON.stringify(entry).replace(/</g, '\\u003c'),
      })),
    }
  })
}

// 根据图片路径生成兜底 alt，避免页面图片完全没有替代文本。
export const createImageAlt = (src, fallbackAlt = '') => {
  if (fallbackAlt) {
    return fallbackAlt
  }

  if (!src) {
    return ''
  }

  const fileName = src.split('/').pop().split('?')[0]
  return fileName.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ')
}
