import { computed, unref, useHead, useI18n, useLocaleHead, useRuntimeConfig, useSeoMeta } from '#imports'
import { defaultDescription, defaultRobots, defaultSeoImage, getPageSeoCopy } from './seo-copy'

const siteName = 'VicastCam'

const isNoindexRobots = (robots = '') => {
  return String(robots).toLowerCase().split(/[,\s]+/).includes('noindex')
}

const createOgLocale = (language = '') => {
  return String(language || '').replace('-', '_')
}

const normalizeStructuredDataEntries = (value) => {
  const normalizedValue = unref(value)
  const entries = Array.isArray(normalizedValue) ? normalizedValue : [normalizedValue]

  return entries.filter(entry => entry && typeof entry === 'object')
}

export const createAbsoluteUrl = (path, siteUrl = 'https://vicastcam.com') => {
  const url = String(path || '').trim()

  if (!url) {
    return ''
  }

  if (/^(?:https?:)?\/\//i.test(url) || /^(?:data|blob):/i.test(url)) {
    return url
  }

  const normalizedSiteUrl = String(siteUrl || 'https://vicastcam.com').replace(/\/+$/, '')
  const normalizedPath = url.startsWith('/') ? url : `/${url}`

  return `${normalizedSiteUrl}${normalizedPath}`
}

export const setupPageSeo = (pageKey, options = {}) => {
  const config = useRuntimeConfig()
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
    const normalizedOptions = Object.fromEntries(
      Object.entries(optionValues || {}).filter(([, value]) => value !== undefined && value !== null && value !== '')
    )
    const seoCopy = getPageSeoCopy(normalizedPageKey, locale.value)

    return {
      siteName,
      description: defaultDescription,
      robots: defaultRobots,
      imageAlt: siteName,
      ...seoCopy,
      ...normalizedOptions,
    }
  })

  const shouldIndexPage = computed(() => !isNoindexRobots(pageSeo.value.robots))
  const pageSeoImage = computed(() => {
    return createAbsoluteUrl(pageSeo.value.image || defaultSeoImage, config.public.siteUrl)
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
    link: shouldIndexPage.value ? localeHead.value.link : [],
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
