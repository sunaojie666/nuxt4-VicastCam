import { computed, useHead, useI18n, useLocaleHead, useSeoMeta } from '#imports'

const defaultRobots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
const privateRobots = 'noindex, nofollow, noarchive'

export const pageSeoCopy = {
  'zh-CN': {
    home: {
      title: '虚拟背景与直播增强工具',
      description: 'VicastCam 为创作者提供虚拟背景、直播增强、多平台推流和跨平台直播工具。',
    },
    download: {
      title: '下载中心',
      description: '下载 VicastCam，支持 Windows、iOS 和 Android 平台。',
    },
    faq: {
      title: '常见问题',
      description: '查看 VicastCam 常见问题、下载、安装和直播使用说明。',
    },
    tutorial: {
      title: '教程中心',
      description: '查看 VicastCam 教程中心，学习下载、安装和使用方法。',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: '查看 VicastCam SDK 文档与 Demo 下载，快速集成虚拟相机、虚拟声卡和投屏能力。',
    },
    login: {
      title: '登录',
      description: '登录 VicastCam 账号。',
      robots: privateRobots,
    },
    profile: {
      title: '个人中心',
      description: 'VicastCam 个人中心页面。',
      robots: privateRobots,
    },
  },
  en: {
    home: {
      title: 'Virtual Backgrounds and Live Streaming Tools',
      description: 'VicastCam helps creators stream with virtual backgrounds, live enhancements, and multi-platform tools.',
    },
    download: {
      title: 'Download Center',
      description: 'Download VicastCam for Windows, iOS, and Android.',
    },
    faq: {
      title: 'FAQ',
      description: 'Find answers about VicastCam downloads, installation, accounts, and live streaming.',
    },
    tutorial: {
      title: 'Tutorial Center',
      description: 'Learn how to download, install, and use VicastCam.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Explore VicastCam SDK documentation and demo downloads for virtual camera, virtual audio, and screen casting integrations.',
    },
    login: {
      title: 'Login',
      description: 'Log in to your VicastCam account.',
      robots: privateRobots,
    },
    profile: {
      title: 'Profile',
      description: 'Your VicastCam profile center.',
      robots: privateRobots,
    },
  },
}

export const getPageSeoCopy = (pageKey, locale = 'zh-CN') => {
  return pageSeoCopy[locale]?.[pageKey] || pageSeoCopy['zh-CN']?.[pageKey] || {}
}

export const setupPageSeo = (pageKey, options = {}) => {
  const { locale } = useI18n()
  const localeHead = useLocaleHead({
    seo: {
      canonicalQueries: [],
    },
  })

  const pageSeo = computed(() => {
    return {
      robots: defaultRobots,
      ...getPageSeoCopy(pageKey, locale.value),
      ...options,
    }
  })

  useHead(() => ({
    meta: localeHead.value.meta,
    link: localeHead.value.link,
    htmlAttrs: localeHead.value.htmlAttrs,
  }))

  useSeoMeta({
    title: () => pageSeo.value.title,
    description: () => pageSeo.value.description,
    robots: () => pageSeo.value.robots,
    ogTitle: () => pageSeo.value.title,
    ogDescription: () => pageSeo.value.description,
    ogType: 'website',
    ogImage: () => pageSeo.value.image || '/images/logo.png',
    twitterCard: 'summary_large_image',
    twitterTitle: () => pageSeo.value.title,
    twitterDescription: () => pageSeo.value.description,
    twitterImage: () => pageSeo.value.image || '/images/logo.png',
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
